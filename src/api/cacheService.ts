// utils/localForage.ts
import localforage from "localforage";

export const cache = {
  set: async (key: string, data: any) => {
    await localforage.setItem(key, data);
  },
  get: async (key: string) => {
    const stored = await localforage.getItem(key);
    return Array.isArray(stored) ? stored : []; // ✅ Ensure always returning an array
  },
  remove: async (key: string) => {
    await localforage.removeItem(key);
  },
};