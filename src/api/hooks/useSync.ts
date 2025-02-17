// src/api/hooks/useSync.ts
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/services/store";
import { syncService } from "@/api/syncService";
import { getSubdomain } from "@/shared/utils/getSubdomains";

const useSync = () => {
  // Get authentication details from Redux.
  const token = useSelector((state: RootState) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  useEffect(() => {
    const syncData = async () => {
      console.log("🔄 Checking for offline updates...");
      // Only attempt sync if token and clinicDb are available.
      if (token && clinicDb) {
        await syncService.syncOfflineActions(token, clinicDb);
      }
    };

    // Immediately run the sync when the hook mounts.
    syncData();
    // Then schedule the sync to run every 30 seconds.
    const interval = setInterval(syncData, 30000);

    return () => clearInterval(interval);
  }, [token, clinicDb]);

  return null;
};

export default useSync;