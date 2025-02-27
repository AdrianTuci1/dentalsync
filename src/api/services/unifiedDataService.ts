import ApiService from "../apiService";
import { cache } from "@/api/cacheService";
import { syncService } from "../syncService";
import { DEMO_MODE } from "@/config";

export interface DemoData {
  patients: any[];
  medics: any[];
  treatments: any[];
  appointments: any[];
  components: any[];
}

export interface ResourceResponse {
  data: any[];
  limit: number;
  offset: number;
}

export class UnifiedDataService {
  private static instance: UnifiedDataService;
  private token: string;
  private clinicDb: string;
  private api: ApiService;
  private batchSize: number = 20;
  private demoDataCache: DemoData | null = null; // Cache demo data to prevent repeated API calls.

  private constructor(token?: string, clinicDb?: string) {
    if (DEMO_MODE) {
      this.token = "demo-token";
      this.clinicDb = "demo-clinic";
    } else {
      if (!token || !clinicDb) {
        throw new Error("Token and clinicDb are required in production mode.");
      }
      this.token = token;
      this.clinicDb = clinicDb;
    }
    
    this.api = ApiService.getInstance(this.token, this.clinicDb);
  }

  public static getInstance(token?: string, clinicDb?: string): UnifiedDataService {
    if (!this.instance) {
      this.instance = new UnifiedDataService(token, clinicDb);
    } else if (token && clinicDb) {
      this.instance.setCredentials(token, clinicDb);
    }
    return this.instance;
  }

  private setCredentials(token: string, clinicDb: string): void {
    this.token = token;
    this.clinicDb = clinicDb;
    this.api.setCredentials(token, clinicDb);
  }

  /**
   * Fetch all demo data and cache it in-memory for performance.
   */
  private async getAllDemoData(): Promise<DemoData> {
    if (this.demoDataCache) return this.demoDataCache;
    this.demoDataCache = await this.api.get<DemoData>("demo-data");
    return this.demoDataCache;
  }

  async getResources<T = any>(
    resource: keyof DemoData,
    params: Record<string, string> = {},
    id?: string
  ): Promise<{ data: T[]; limit?: number; offset?: number }> {
    console.log("UnifiedDataService.getResources called with:", resource, params);
  
    // **1️⃣ Handle Demo Mode**
    if (DEMO_MODE) {
      const demoData: DemoData = await this.getAllDemoData();
      if (id) {
        const item = (demoData[resource] as T[] | undefined)?.find((item) => (item as any).id === id);
        return { data: item ? [item] : [] };
      }
      return { data: (demoData[resource] as T[]) || [] };
    }
  
    // ✅ **Handle Offline Mode - Use Cached Data if No Internet**
    if (!navigator.onLine) {
      console.log(`🔌 Offline mode: Using cached data for '${resource}'`);
  
      const cachedData: T[] = (await cache.get(resource)) ?? [];
      if (!cachedData.length) {
        console.warn(`⚠️ No cached data found for '${resource}' while offline.`);
      }
      
      return { data: cachedData };
    }
  
    // **3️⃣ Fetch Data from API**
    try {
      const endpoint = id ? `${resource}/${id}` : resource;
      const result = await this.api.get<{ data?: T[]; limit?: number; offset?: number } | T[]>(endpoint, params);
      console.log("✅ API result received:", result);
  
      // **4️⃣ Determine API Response Format**
      let responseData: T[];
      if (Array.isArray(result)) {
        responseData = result; // Direct array response
      } else if (Array.isArray(result.data)) {
        responseData = result.data; // Object with "data" key
      } else if (Array.isArray((result as any)[resource])) {
        responseData = (result as any)[resource]; // Object with resource key
      } else {
        throw new Error(`Invalid API response structure for ${resource}`);
      }
  
      // ✅ **Determine if this resource is paginated or full-set**
      const isPaginated = params.hasOwnProperty("offset"); // Checks if request had "offset"
  
      if (isPaginated) {
        console.log(`📄 Paginated data detected for '${resource}'`);
  
        // 🔹 Merge with previously cached data to prevent duplicates
        const existingCache: T[] = (await cache.get(resource)) ?? [];
        const mergedData = [...existingCache, ...responseData].reduce(
          (acc, item) => acc.find((i) => (i as any).id === (item as any).id) ? acc : [...acc, item], 
          [] as T[]
        );
  
        await cache.set(resource, mergedData);
      } else {
        console.log(`📦 Full dataset detected for '${resource}', caching all.`);
        await cache.set(resource, responseData);
      }
  
      return {
        data: responseData,
        limit: (result as any).limit ?? undefined,
        offset: (result as any).offset ?? undefined,
      };
    } catch (error) {
      console.error(`❌ Error fetching '${resource}':`, error);
  
      // Load from cache in case of API failure
      const cachedData: T[] = (await cache.get(resource)) ?? [];
      console.log(`📂 Using cached data for '${resource}' due to API failure (${cachedData.length} records)`);
  
      return { data: cachedData };
    }
  }

  async getResourceById<T = any>(
    resource: keyof DemoData,
    id: string,
    params: Record<string, string> = {}
  ): Promise<T | null> {
    console.log(`Fetching '${resource}' with ID '${id}'`);

    if (DEMO_MODE) {
      const demoData = await this.getAllDemoData();
      return demoData[resource]?.find((item) => (item as any).id === id) ?? null;
    }

    if (!navigator.onLine) {
      console.log(`🔌 Offline: Fetching cached '${resource}' with ID '${id}'`);
      const cachedData: T[] = (await cache.get(resource)) ?? [];
      return cachedData.find((item) => (item as any).id === id) ?? null;
    }

    try {
      const result = await this.api.get<T>(`${resource}/${id}`, params);
      const cachedData: T[] = (await cache.get(resource)) ?? [];
      const updatedCache = cachedData.map((item) => (item as any).id === id ? result : item);
      if (!updatedCache.some((item) => (item as any).id === id)) {
        updatedCache.unshift(result);
      }
      const cacheLimit = resource === "appointments" ? 60 : 20;
      await cache.set(resource, updatedCache.slice(0, cacheLimit));

      return result;
    } catch (error) {
      console.error(`❌ Failed to fetch '${resource}' with ID '${id}', using cache.`, error);

      const cachedData: T[] = (await cache.get(resource)) ?? [];
      
      // ✅ Use `appointmentId` for `appointments`, otherwise default to `id`
      const identifier = resource === "appointments" ? "appointmentId" : "id";
      
      return cachedData.find((item) => (item as any)[identifier] === id) ?? null;
    }
  }

  async createResource(resource: keyof DemoData, payload: any): Promise<any> {
    const resourceIdField = resource === "appointments" ? "appointmentId" : "id";
  
    const offlineData = {
      ...payload,
      [resourceIdField]: `offline-${Date.now()}`,
    };
  
    // Optimistic cache update
    const existingCache = (await cache.get(resource)) || [];
    await cache.set(resource, [...existingCache, offlineData]);
  
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing CREATE for ${resource}`);
      if (!DEMO_MODE) {
        // Remove id from payload if not needed by syncService:
        await syncService.addAction({ type: "CREATE", resource, payload: { ...payload } });
      }
      return offlineData;
    }
  
    try {
      const result = await this.api.post(resource, payload);
      const updatedCache = [...((await cache.get(resource)) || []), result];
      await cache.set(resource, updatedCache);
      return result;
    } catch (error) {
      console.error(`❌ API Failed: Create ${resource}`, error);
      return offlineData;
    }
  }
  
  // ✅ Update & Cache Data (Even if API Fails)
  async updateResource<T>(
    resource: keyof DemoData,
    id: string,
    changes: Partial<T>
  ): Promise<T> {
    const resourceIdField = resource === "appointments" ? "appointmentId" : "id";
  
    const optimisticUpdate = { [resourceIdField]: id, ...changes } as T;
  
    // ✅ Optimistically update cache immediately
    const existingCache: T[] = (await cache.get(resource)) || [];
    const updatedCache = existingCache.map((item) =>
      (item as any)[resourceIdField] === id ? { ...item, ...changes } : item
    );
  
    if (!existingCache.some((item) => (item as any)[resourceIdField] === id)) {
      updatedCache.unshift(optimisticUpdate);
    }
  
    await cache.set(resource, updatedCache);
  
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing UPDATE for ${resource}`);
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "UPDATE", resource, payload: optimisticUpdate });
      }
      return optimisticUpdate;
    }
  
    try {
      const updatedResource = await this.api.put<T>(resource, id, changes);
  
      // ✅ Replace optimistic cache entry with confirmed API response
      const confirmedCache = updatedCache.map((item) =>
        (item as any)[resourceIdField] === id ? updatedResource : item
      );
      await cache.set(resource, confirmedCache);
  
      return updatedResource;
    } catch (error) {
      console.error(`❌ API Failed: Update ${resource}/${id}`, error);
  
      // ✅ Queue failed API update for later sync
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "UPDATE", resource, payload: optimisticUpdate });
      }
  
      // ✅ Keep optimistic data in cache, API sync will handle it later.
      return optimisticUpdate;
    }
  }


  async patchResource<T>(resource: keyof DemoData, id: string, changes: Partial<T>): Promise<T> {
    const resourceIdField = resource === "appointments" ? "appointmentId" : "id";
  
    const optimisticUpdate = { [resourceIdField]: id, ...changes } as T;
  
    // ✅ Optimistic cache update before API call
    const existingCache: T[] = (await cache.get(resource)) || [];
    const updatedCache = existingCache.map((item) =>
      (item as any)[resourceIdField] === id ? { ...item, ...changes } : item
    );
    await cache.set(resource, updatedCache);
  
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing PATCH for ${resource} (ID: ${id})`);
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "PATCH", resource, payload: optimisticUpdate });
      }
      return optimisticUpdate;
    }
  
    try {
      const updatedResource = await this.api.patch<T>(resource, id, changes);
  
      // ✅ Update cache after successful API response
      const finalCache = existingCache.map((item) =>
        (item as any)[resourceIdField] === id ? updatedResource : item
      );
      await cache.set(resource, finalCache);
  
      return updatedResource;
    } catch (error) {
      console.error(`❌ API Failed: Patch ${resource}/${id}`, error);
      return optimisticUpdate; // Still return the optimistic update
    }
  }
  
  // ✅ DELETE with Guaranteed Cache Update
  async deleteResource(resource: keyof DemoData, id: string): Promise<string> {
    const resourceIdField = resource === "appointments" ? "appointmentId" : "id";
  
    // ✅ Optimistic cache update before API call
    const existingCache: any[] = (await cache.get(resource)) || [];
    const updatedCache = existingCache.filter((item) => item[resourceIdField] !== id);
    await cache.set(resource, updatedCache);
  
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing DELETE for ${resource} (ID: ${id})`);
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "DELETE", resource, payload: { [resourceIdField]: id } });
      }
      return id;
    }
  
    try {
      await this.api.delete(resource, id);
      return id;
    } catch (error) {
      console.error(`❌ API Failed: Delete ${resource}/${id}`, error);
      return id; // Still return the deleted ID
    }
  }
}

export default UnifiedDataService;