import { useEffect } from "react";
import SyncService from "@/api/syncService";

const useSync = () => {
  useEffect(() => {
    const syncData = async () => {
      console.log("🔄 Checking for offline updates...");
      const result = await SyncService.syncToServer();
      if (result.success) {
        console.log("✅ Sync complete.");
      } else {
        console.error("❌ Sync failed:", result.message);
      }
    };

    // Sync immediately on mount
    syncData();

    // Optional: Reattempt sync every X seconds
    const interval = setInterval(syncData, 30000); // Every 30 sec

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default useSync;