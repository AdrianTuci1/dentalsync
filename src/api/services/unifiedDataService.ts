// src/api/services/unifiedDataService.ts
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
  private token: string;
  private clinicDb: string;
  private api: ApiService;
  // The batch size is used only in demo/offline mode.
  private batchSize: number = 20;

  constructor(token?: string, clinicDb?: string) {
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



  /**
   * Fetch a list of resources.
   *
   * In production mode, this calls the API with the provided query parameters.
   * In demo mode, it calls the demo endpoint, slices the resource data according
   * to the offset and batch size, and returns an object with { data, limit, offset }.
   *
   * @param resource - The resource key (e.g., "patients", "components")
   * @param params - Query parameters, e.g. { name: "John", offset: "0" }
   */
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


  /**
   * Fetch a single resource by its id.
   *
   * In production mode, it calls the endpoint "resource/{id}".
   * In demo mode, it fetches all demo data and returns the item with matching id.
   *
   * @param resource - The resource key (e.g., "patients", "components")
   * @param id - The id of the desired resource.
   * @param params - Optional query parameters.
   */
  async getResourceById(
    resource: keyof DemoData,
    id: string,
    params: Record<string, string> = {}
  ): Promise<any> {
    if (DEMO_MODE) {
      const demoData: DemoData = await this.getAllDemoData();
      return (demoData[resource] || []).find((item) => item.id === id);
    }

    if (!navigator.onLine) {
      console.log(`Offline: Using cached data for ${resource}`);
      // When offline, you may try to read from cache and then find the item.
      const cached: any[] = (await cache.get(resource)) as any[];
      return cached.find((item) => item.id === id);
    }

    // Production mode online: Construct endpoint with id.
    const endpoint = `${resource}/${id}`;
    const data = await this.api.get(endpoint, params);
    // Optionally update cache if needed.
    return data;
  }


  /**
   * For demo mode: Fetch all data in one request.
   */
  async getAllDemoData(): Promise<DemoData> {
    return await this.api.get<DemoData>("demo-data");
  }

  // --- Mutations: Create, Update, Delete (not modified in this example) ---

  async createResource(resource: keyof DemoData, payload: any): Promise<any> {
    if (!navigator.onLine || DEMO_MODE) {
      const offlineData = { ...payload, id: `offline-${Date.now()}` };
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "CREATE", resource: resource as any, payload: offlineData });
      }
      return offlineData;
    }
    return await this.api.post(resource, payload);
  }

  async updateResource(resource: keyof DemoData, id: string, changes: any): Promise<any> {
    if (!navigator.onLine || DEMO_MODE) {
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "UPDATE", resource: resource as any, payload: { id, ...changes } });
      }
      return { id, ...changes };
    }
    return await this.api.put(`${resource}/${id}`, changes);
  }

  async deleteResource(resource: keyof DemoData, id: string): Promise<any> {
    if (!navigator.onLine || DEMO_MODE) {
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "DELETE", resource: resource as any, payload: { id } });
      }
      return id;
    }
    return await this.api.delete(`${resource}/${id}`);
  }

  async syncOfflineActions(): Promise<void> {
    if (!navigator.onLine || DEMO_MODE) return;
    const queue = await syncService.getQueue();
    if (queue.length === 0) return;
    try {
      await this.api.post("sync", { actions: queue });
      await syncService.clearQueue();
      console.log("Sync successful.");
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }
}

export default UnifiedDataService;