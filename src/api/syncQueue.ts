import localforage from "localforage";

export type OfflineUpdate = {
  id?: string;
  type: "treatment" | "component" | "medic" | "patient" | "appointment";
  action: "create" | "update" | "delete";
  data: any;
};

/** ✅ Add an update to the offline queue */
export const queueOfflineUpdate = async (update: OfflineUpdate) => {
  const queue = (await localforage.getItem<OfflineUpdate[]>("offlineQueue")) || [];
  queue.push(update);
  await localforage.setItem("offlineQueue", queue);
  console.log("📌 Offline update queued:", update);
};

/** ✅ Get queued updates */
export const getOfflineQueue = async (): Promise<OfflineUpdate[]> => {
  return (await localforage.getItem<OfflineUpdate[]>("offlineQueue")) || [];
};

/** ✅ Clear queued updates */
export const clearOfflineQueue = async () => {
  await localforage.removeItem("offlineQueue");
  console.log("🗑️ Cleared offline update queue.");
};