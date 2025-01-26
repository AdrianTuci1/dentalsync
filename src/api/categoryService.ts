import { saveOfflineData, getOfflineData } from '@/shared/utils/localForage';
import { queueOfflineEdit, syncOfflineEdits } from '@/shared/services/syncService';

const CATEGORIES_CACHE_KEY = 'categories_cache'; // Cache key for all categories
const FILTERED_CATEGORIES_KEY_PREFIX = 'categories_search_'; // Prefix for filtered categories

class CategoryService {
  private baseUrl: string;
  private clinicDb: string;

  constructor(clinicDb: string) {
    this.baseUrl = import.meta.env.VITE_SERVER; // Server URL from .env file
    this.clinicDb = clinicDb;
  }

  /**
   * Fetch all unique categories with offline caching
   */
  async getAllCategories(): Promise<string[]> {
    try {
      // Try to get cached categories first
      const cachedCategories = await getOfflineData<string[]>(CATEGORIES_CACHE_KEY);
      if (cachedCategories) {
        console.log('Serving cached categories');
        // Fetch in the background to update the cache
        this.fetchAndCacheCategories();
        return cachedCategories;
      }

      // Fetch from server if no cache exists
      return await this.fetchAndCacheCategories();
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  }

  /**
   * Fetch filtered categories based on search query with offline caching
   */
  async getFilteredCategories(search: string): Promise<string[]> {
    const cacheKey = `${FILTERED_CATEGORIES_KEY_PREFIX}${search}`; // Cache key based on search query

    try {
      // Try to get cached filtered categories first
      const cachedData = await getOfflineData<string[]>(cacheKey);
      if (cachedData) {
        console.log('Serving cached filtered categories');
        // Fetch in the background to update the cache
        this.fetchAndCacheFilteredCategories(search, cacheKey);
        return cachedData;
      }

      // Fetch from server if no cache exists
      return await this.fetchAndCacheFilteredCategories(search, cacheKey);
    } catch (error) {
      console.error('Error in getFilteredCategories:', error);
      throw error;
    }
  }

  /**
   * Add a new category with offline syncing
   */
  async addCategory(category: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clinic-Db': this.clinicDb,
        },
        body: JSON.stringify({ name: category }),
      });

      if (!response.ok) {
        throw new Error(`Error adding category: ${response.statusText}`);
      }

      console.log('Category added successfully:', category);
    } catch (error) {
      console.warn('Offline: Queuing category addition for sync');
      await queueOfflineEdit({
        endpoint: '/api/categories',
        method: 'POST',
        data: { name: category },
        headers: { 'X-Clinic-Db': this.clinicDb },
      });
    }
  }

  /**
   * Sync offline edits for categories
   */
  async syncCategories(): Promise<void> {
    try {
      await syncOfflineEdits(this.baseUrl); // Sync queued edits using SyncService
    } catch (error) {
      console.error('Error syncing categories:', error);
    }
  }

  /**
   * Fetch categories from server and update the cache
   */
  private async fetchAndCacheCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Clinic-Db': this.clinicDb,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const categories = await response.json();
    await saveOfflineData(CATEGORIES_CACHE_KEY, categories); // Cache the data
    return categories;
  }

  /**
   * Fetch filtered categories from server and update the cache
   */
  private async fetchAndCacheFilteredCategories(search: string, cacheKey: string): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/api/categories/look?search=${encodeURIComponent(search)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Clinic-Db': this.clinicDb,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching filtered categories: ${response.statusText}`);
    }

    const filteredCategories = await response.json();
    await saveOfflineData(cacheKey, filteredCategories); // Cache the data
    return filteredCategories;
  }
}

export default CategoryService;