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
   * Create components (single or batch) with offline support.
   */
  async createComponents(componentsData: Partial<Component>[]): Promise<Component[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/components`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(componentsData),
      });

      if (!response.ok) {
        throw new Error('Failed to create components');
      }

      const createdComponents = await response.json();

      // Update the cache with the new components
      const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
      await saveOfflineData(COMPONENTS_CACHE_KEY, [...cachedComponents, ...createdComponents]);

      return createdComponents;
    } catch (error) {
      console.warn('Offline: Queuing component creation for sync');
      await queueOfflineEdit({
        endpoint: '/api/components',
        method: 'POST',
        data: componentsData,
      });
      throw error;
    }
  }

  /**
   * Fetch all components with offline caching.
   */
  async getAllComponents(
    name: string = '',
    offset: number = 0
  ): Promise<{ components: Component[]; offset: number }> {
    try {
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
   * Update components (single or batch) with offline support.
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
      });
      throw error;
    }
  }

  /**
   * Delete components (single or batch) with offline support.
   */
  async deleteComponents(componentIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/components`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify(componentIds),
      });

      if (!response.ok) {
        throw new Error('Failed to delete components');
      }

      // Remove the components from the cache
      const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
      const updatedCache = cachedComponents.filter(
        (comp) => !componentIds.includes(comp.id)
      );
      await saveOfflineData(COMPONENTS_CACHE_KEY, updatedCache);
    } catch (error) {
      console.warn('Offline: Queuing component deletion for sync');
      await queueOfflineEdit({
        endpoint: '/api/components',
        method: 'DELETE',
        data: componentIds,
      });
      throw error;
    }
  }

  /**
   * Fetch components from the server and update the cache.
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

    // Update the cache by merging fetched data with cached data
    const cachedComponents = (await getOfflineData<Component[]>(COMPONENTS_CACHE_KEY)) || [];
    const updatedCache = cachedComponents
      .concat(data.components)
      .filter((comp, index, self) => index === self.findIndex((c) => c.id === comp.id));

    await saveOfflineData(COMPONENTS_CACHE_KEY, updatedCache);

    return { components: data.components, offset: data.offset };
  }
}

export default ComponentService;