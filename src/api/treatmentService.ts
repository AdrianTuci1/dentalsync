import { Treatment } from "@/features/clinic/types/treatmentType";

class TreatmentService {
  private static instance: TreatmentService;
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  public constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER;
  }

  public static getInstance(token: string, clinicDb: string): TreatmentService {
    if (!TreatmentService.instance) {
      TreatmentService.instance = new TreatmentService(token, clinicDb);
    }
    return TreatmentService.instance;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "x-clinic-db": this.clinicDb,
    };
  }

  // ✅ Create a new treatment
  async createTreatment(treatmentData: Partial<Treatment>): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to create treatment: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.treatments || data.treatments.length === 0) {
        throw new Error("Invalid API response: No treatments found");
      }

      return data.treatments[0]; // ✅ Return only the first created treatment
    } catch (error) {
      console.error("❌ Error in createTreatment:", error);
      throw error;
    }
  }

  // ✅ Fetch all treatments
  async getAllTreatments(name: string = ""): Promise<Treatment[]> {
    try {
      const query = new URLSearchParams({ name }).toString();
      const response = await fetch(`${this.baseUrl}/api/treatments?${query}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch treatments: ${errorMessage}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error in getAllTreatments:", error);
      throw error;
    }
  }

  // ✅ Update an existing treatment
  async updateTreatment(id: string, treatmentData: Partial<Treatment>): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update treatment: ${errorMessage}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error in updateTreatment:", error);
      throw error;
    }
  }

  // ✅ Delete a treatment
  async deleteTreatment(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete treatment: ${errorMessage}`);
      }
    } catch (error) {
      console.error("❌ Error in deleteTreatment:", error);
      throw error;
    }
  }
}

export default TreatmentService;