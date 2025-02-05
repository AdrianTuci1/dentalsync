import { Component } from '@/features/clinic/types/componentType'; // Import the Component type

class ComponentService {
  private static instance: ComponentService;
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER; // Base server URL from Vite environment variable
  }


  // Singleton getter: returns the same instance if it exists
  public static getInstance(token: string, clinicDb: string): ComponentService {
    if (!ComponentService.instance) {
      ComponentService.instance = new ComponentService(token, clinicDb);
    }
    return ComponentService.instance;
  }


  // Get headers for requests
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'x-clinic-db': this.clinicDb,
    };
  }

  // Create a new component
  async createComponent(componentData: Partial<Component>): Promise<Component> {
    const response = await fetch(`${this.baseUrl}/api/components`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(componentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create component');
    }

    const data = await response.json();
    return data;
  }

    // Fetch components with optional search and pagination
    async getAllComponents(name: string = '', offset: number = 0): Promise<{ components: Component[]; offset: number }> {
      const query = new URLSearchParams({
        name,
        offset: offset.toString(), // Convert offset to string for query params
      }).toString();

      const response = await fetch(`${this.baseUrl}/api/components?${query}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }

      const data = await response.json();
      return { components: data.components, offset: data.offset };
    }


  // Update a component by ID
  async updateComponent(
    componentId: string,
    componentData: Partial<Component>
  ): Promise<Component> {
    const response = await fetch(`${this.baseUrl}/api/components/${componentId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(componentData),
    });

    if (!response.ok) {
      throw new Error('Failed to update component');
    }

    const data = await response.json();
    return data;
  }

  // Delete a component by ID
  async deleteComponent(componentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/components/${componentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete component');
    }
  }
}

export default ComponentService;