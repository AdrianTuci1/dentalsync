import { Component } from '@/features/clinic/types/componentType'; // Import the Component type
import { saveOfflineData, getOfflineData } from '@/shared/utils/localForage';
import { queueOfflineEdit } from '@/shared/services/syncService';

const COMPONENTS_CACHE_KEY = 'components_cache';

class ComponentService {
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER; // Base server URL from Vite environment variable
  }

  // Get headers for requests
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'x-clinic-db': this.clinicDb,
    };
  }

  /**
   * Create a new component with offline support.
   * - If offline, queue the creation for sync.
   */
  async createComponent(componentData: Partial<Component>): Promise<Component> {
    try {
      const response = await fetch(`${this.baseUrl}/api/components`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(componentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create component');
      }

      const data = await response.json();

      // Update the cache with the new component
      const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
      await saveOfflineData(COMPONENTS_CACHE_KEY, [...cachedComponents, data]);

      return data;
    } catch (error) {
      console.warn('Offline: Queuing component creation for sync');
      await queueOfflineEdit({
        endpoint: '/api/components',
        method: 'POST',
        data: componentData,
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Fetch components with offline caching.
   * - Serve cached data if available.
   * - Fetch fresh data in the background to update the cache.
   */
  async getAllComponents(
    name: string = '',
    offset: number = 0
  ): Promise<{ components: Component[]; offset: number }> {
    try {
      // Fetch fresh data from server
      const data = await this.fetchAndCacheComponents(name, offset);
      return data;
    } catch (fetchError) {
      console.warn('Error fetching components, falling back to cached data', fetchError);

      // Serve cached data as a fallback
      const cachedComponents = await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY);
      if (cachedComponents) {
        console.log('Serving cached components');
        return { components: cachedComponents.slice(offset, offset + 20), offset };
      }

      throw new Error('Failed to fetch components, and no cached data available.');
    }
  }

  /**
   * Update a component with offline support.
   * - If offline, queue the update for sync.
   */
  async updateComponent(
    componentId: string,
    componentData: Partial<Component>
  ): Promise<Component> {
    try {
      const response = await fetch(`${this.baseUrl}/api/components/${componentId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(componentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update component');
      }

      const updatedComponent = await response.json();

      // Update the cache with the updated component
      const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
      const updatedCache = cachedComponents.map((comp) =>
        comp.id === componentId ? updatedComponent : comp
      );
      await saveOfflineData(COMPONENTS_CACHE_KEY, updatedCache);

      return updatedComponent;
    } catch (error) {
      console.warn('Offline: Queuing component update for sync');
      await queueOfflineEdit({
        endpoint: `/api/components/${componentId}`,
        method: 'PUT',
        data: componentData,
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Delete a component with offline support.
   * - If offline, queue the deletion for sync.
   */
  async deleteComponent(componentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/components/${componentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete component');
      }

      // Remove the component from the cache
      const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
      const updatedCache = cachedComponents.filter((comp) => comp.id !== componentId);
      await saveOfflineData(COMPONENTS_CACHE_KEY, updatedCache);
    } catch (error) {
      console.warn('Offline: Queuing component deletion for sync');
      await queueOfflineEdit({
        endpoint: `/api/components/${componentId}`,
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Fetch components from server and update the cache.
   */
  private async fetchAndCacheComponents(
    name: string,
    offset: number
  ): Promise<{ components: Component[]; offset: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/components?name=${encodeURIComponent(name)}&offset=${offset}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch components');
    }

    const data = await response.json();

    // Avoid duplication by merging fresh data into the cache
    const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
    const updatedCache = [...cachedComponents, ...data.components].filter(
      (comp, index, self) => index === self.findIndex((c) => c.id === comp.id)
    );

    await saveOfflineData(COMPONENTS_CACHE_KEY, updatedCache);

    return { components: data.components, offset: data.offset };
  }
}

export default ComponentService;