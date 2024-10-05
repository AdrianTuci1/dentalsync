export interface Component {
    id: string;
    componentName: string;
    unitPrice: number;
    vendor: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }
  
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
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
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
  
    // Get all components
    async getAllComponents(): Promise<Component[]> {
      const response = await fetch(`${this.baseUrl}/api/components`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }
  
      const data = await response.json();
      return data;
    }
  
    // Update a component by ID
    async updateComponent(componentId: string, componentData: Partial<Component>): Promise<Component> {
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
  