import { ApiMedicData, MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";

class MedicService {
  private static instance: MedicService;
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  private constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER;
  }

  public static getInstance(token: string, clinicDb: string): MedicService {
    if (!MedicService.instance) {
      MedicService.instance = new MedicService(token, clinicDb);
    }
    return MedicService.instance;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      "x-clinic-db": this.clinicDb,
    };
  }

  async fetchMedics(): Promise<MedicsListItem[]> {
    const response = await fetch(`${this.baseUrl}/api/medics`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch medics");
    }

    return response.json();
  }

  async fetchMedicById(medicId: string): Promise<ApiMedicData> {
    const response = await fetch(`${this.baseUrl}/api/medics/${medicId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch medic details");
    }

    return response.json();
  }

  async createMedic(medicData: Partial<MedicInfo>): Promise<MedicInfo> {
    const response = await fetch(`${this.baseUrl}/api/medics`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(medicData),
    });

    if (!response.ok) {
      throw new Error("Failed to create medic");
    }

    return response.json();
  }

  async updateMedic(id: string, medicData: Partial<MedicInfo>): Promise<MedicInfo> {
    const response = await fetch(`${this.baseUrl}/api/medics/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(medicData),
    });

    if (!response.ok) {
      throw new Error("Failed to update medic");
    }

    return response.json();
  }

  async deleteMedic(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/medics/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete medic");
    }
  }

}

export default MedicService;