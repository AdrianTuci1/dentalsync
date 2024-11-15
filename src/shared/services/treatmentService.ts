import { Category } from "../../clinic/components/drawers/addMedic/TreatmentAccordion";
import { Treatment } from "../../clinic/types/treatmentType";

class TreatmentService {
    private token: string;
    private clinicDb: string;
    private baseUrl: string;
  
    constructor(token: string, clinicDb: string) {
      this.token = token;
      this.clinicDb = clinicDb;
      this.baseUrl = import.meta.env.VITE_SERVER; // Base server URL from Vite environment variable
    }
  
    // Headers for requests
    private getHeaders() {
      return {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'x-clinic-db': this.clinicDb,
      };
    }
  
    // Create a new treatment
    async createTreatment(treatmentData: Partial<Treatment>): Promise<Treatment> {
      const response = await fetch(`${this.baseUrl}/api/treatments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create treatment');
      }
  
      const data = await response.json();
      return data;
    }
  
    // Get all treatments
    async getAllTreatments(): Promise<Treatment[]> {
      const response = await fetch(`${this.baseUrl}/api/treatments`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch treatments');
      }
  
      const data = await response.json();
      return data.treatments;
    }
  
    // Get treatment by ID
    async getTreatmentById(treatmentId: string): Promise<Treatment> {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch treatment');
      }
  
      const data = await response.json();
      return data.treatment;
    }
  
    // Update a treatment by ID
    async updateTreatment(treatmentId: string, treatmentData: Partial<Treatment>): Promise<Treatment> {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update treatment');
      }
  
      const data = await response.json();
      return data;
    }
  
    // Delete a treatment by ID
    async deleteTreatment(treatmentId: string): Promise<void> {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete treatment');
      }
    }



  // Get treatments sorted by category
  async getTreatmentsByCategory(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/api/treatments/category`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch treatments by category');
    }

    const data = await response.json();
    return data; // Assuming the response is already formatted as an array of categories with their treatments
  }

  }



  
  export default TreatmentService;
  