import localforage from "localforage";
import { getOfflineQueue, clearOfflineQueue } from "./syncQueue";

class SyncService {
  private baseUrl: string = import.meta.env.VITE_SERVER;

  private async getHeaders() {
    const token = await localforage.getItem<string>("authToken");
    const clinicDb = await localforage.getItem<string>("clinicDb");

    if (!token || !clinicDb) {
      throw new Error("🔴 Missing authentication or clinic database information.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-clinic-db": clinicDb,
    };
  }

  /** ✅ Send all queued offline updates to `/api/sync` */
  async syncToServer(): Promise<{ success: boolean; message?: string }> {
    try {
      const queuedUpdates = await getOfflineQueue();

      if (queuedUpdates.length === 0) {
        console.log("✅ No offline updates to sync.");
        return { success: true };
      }

      console.log("🔄 Sending batch sync request to server:", queuedUpdates);

      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: "POST",
        headers,
        body: JSON.stringify({ updates: queuedUpdates }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`❌ Failed to sync offline updates: ${errorMsg}`);
      }

      // Clear queue after successful sync
      await clearOfflineQueue();

      const data = await response.json();
      console.log("✅ Sync successful:", data);
      return { success: true };
    } catch (error) {
      console.error("❌ Error in syncToServer:", error);
      return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}

export default new SyncService();