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

    if (DEMO_MODE) {
      const demoData: DemoData = await this.getAllDemoData();
      if (id) {
        const item = demoData[resource]?.find((item) => (item as any).id === id);
        return { data: item ? [item] : [] };
      }
      return { data: demoData[resource] ?? [] };
    }

    if (!navigator.onLine) {
      console.log(`🔌 Offline: Using cached data for '${resource}'`);
      const cachedData: T[] = (await cache.get(resource)) ?? [];
      return { data: cachedData };
    }

    try {
      const endpoint = id ? `${resource}/${id}` : resource;
      const result = await this.api.get<ResourceResponse | T[]>(endpoint, params);
      
      let responseData: T[] = Array.isArray(result) ? result : result.data ?? [];
      
      const isPaginated = params.hasOwnProperty("offset");
      if (isPaginated) {
        console.log(`📄 Paginated data for '${resource}'`);
        const existingCache: T[] = (await cache.get(resource)) ?? [];
        const mergedData = [...existingCache, ...responseData].reduce(
          (acc, item) => acc.find((i) => (i as any).id === (item as any).id) ? acc : [...acc, item], [] as T[]
        );
        await cache.set(resource, mergedData);
        console.log(mergedData)
      } else {
        console.log(`📦 Full dataset for '${resource}', caching all.`);
        await cache.set(resource, responseData);
      }

      return {
        data: responseData,
        limit: (result as any).limit ?? undefined,
        offset: (result as any).offset ?? undefined,
      };
    } catch (error) {
      console.error(`❌ API failure fetching '${resource}', using cache.`, error);
      const cachedData: T[] = (await cache.get(resource)) ?? [];
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
      return cachedData.find((item) => (item as any).id === id) ?? null;
    }
  }

  async createResource(resource: keyof DemoData, payload: any): Promise<any> {
    if (!navigator.onLine || DEMO_MODE) {
      const offlineData = { ...payload, id: `offline-${Date.now()}` };
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "CREATE", resource, payload: offlineData });
      }
      return offlineData;
    }
    return await this.api.post(resource, payload);
  }

  async updateResource<T>(resource: keyof DemoData, id: string, changes: Partial<T>): Promise<T> {
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing update for ${resource} (ID: ${id})`);
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "UPDATE", resource, payload: { id, ...changes } });
      }
      return { id, ...changes } as T;
    }
    return await this.api.put<T>(resource, id, changes);
  }

  async deleteResource(resource: keyof DemoData, id: string): Promise<string> {
    if (!navigator.onLine || DEMO_MODE) {
      console.log(`🔌 Offline: Queuing delete for ${resource} (ID: ${id})`);
      if (!DEMO_MODE) {
        await syncService.addAction({ type: "DELETE", resource, payload: { id } });
      }
      return id;
    }
    await this.api.delete(resource, id);
    return id;
  }
}

export default UnifiedDataService;