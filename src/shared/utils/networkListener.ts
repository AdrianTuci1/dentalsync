import SyncService from "@/api/syncService";

class NetworkService {
  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  private handleOnline = async () => {
    console.log("🌐 Internet reconnected. Attempting to sync offline data...");
    await SyncService.syncToServer();
  };

  private handleOffline = () => {
    console.log("⚠️ Internet disconnected. Queuing offline updates.");
  };

  public isOnline(): boolean {
    return navigator.onLine;
  }
}

export default new NetworkService();