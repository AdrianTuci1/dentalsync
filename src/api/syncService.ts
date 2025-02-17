// src/api/services/syncService.ts
import { cache } from "./cacheService";
import ApiService from "./apiService";

export type SyncAction = {
  type: "CREATE" | "UPDATE" | "DELETE" | "PATCH";
  resource: "patients" | "medics" | "treatments" | "appointments" | "components";
  payload: any;
};

const SYNC_QUEUE_KEY = "syncQueue";

export const syncService = {
  async addAction(action: SyncAction): Promise<void> {
    const queue: SyncAction[] = (await cache.get(SYNC_QUEUE_KEY)) || [];
    queue.push(action);
    await cache.set(SYNC_QUEUE_KEY, queue);
  },

  async getQueue(): Promise<SyncAction[]> {
    return (await cache.get(SYNC_QUEUE_KEY)) || [];
  },

  async clearQueue(): Promise<void> {
    await cache.remove(SYNC_QUEUE_KEY);
  },

  // Sync offline actions to the server
  async syncOfflineActions(token: string, clinicDb: string): Promise<void> {
    if (!navigator.onLine) return;
    const queue = await this.getQueue();
    if (queue.length === 0) return;
    
    const api = ApiService.getInstance(token, clinicDb);
    try {
      await api.post("sync", { actions: queue });
      await this.clearQueue();
      console.log("Offline actions synced successfully");
    } catch (error) {
      console.error("Sync failed:", error);
    }
  },
};