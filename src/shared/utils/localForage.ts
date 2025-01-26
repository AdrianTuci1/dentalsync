import localforage from 'localforage';

// Configure LocalForage
const localForageInstance = localforage.createInstance({
  name: 'DentalSyncApp',
  storeName: 'offline_data', // Store data under this name
});

// Save data
export async function saveOfflineData<T>(key: string, data: T): Promise<void> {
  try {
    await localForageInstance.setItem(key, data);
    console.log(`Data saved offline under key: ${key}`);
  } catch (error) {
    console.error(`Error saving offline data: ${key}`, error);
  }
}

// Get data
export async function getOfflineData<T>(key: string): Promise<T | null> {
  try {
    const data = await localForageInstance.getItem<T>(key);
    return data;
  } catch (error) {
    console.error(`Error retrieving offline data: ${key}`, error);
    return null;
  }
}

// Remove data
export async function removeOfflineData(key: string): Promise<void> {
  try {
    await localForageInstance.removeItem(key);
    console.log(`Data removed offline: ${key}`);
  } catch (error) {
    console.error(`Error removing offline data: ${key}`, error);
  }
}

// Clear all data
export async function clearOfflineData(): Promise<void> {
  try {
    await localForageInstance.clear();
    console.log(`All offline data cleared.`);
  } catch (error) {
    console.error(`Error clearing offline data:`, error);
  }
  
}

export default localForageInstance;