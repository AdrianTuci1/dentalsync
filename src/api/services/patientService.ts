class PatientService {
  private static instance: PatientService;
  private subaccountToken: string;
  private database: string;
  private BASE_URL = import.meta.env.VITE_SERVER;

  private constructor(subaccountToken: string, database: string) {
    this.subaccountToken = subaccountToken;
    this.database = database;
  }

  // ✅ Singleton pattern to get the instance
  public static getInstance(subaccountToken: string, database: string): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService(subaccountToken, database);
    }
    return PatientService.instance;
  }

  // Helper method to configure headers
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.subaccountToken}`,
      "x-clinic-db": this.database,
    };
  }

  // ✅ Fetch patients (Paginated)
  async getPatients(name = "", offset = 0) {
    try {
      const query = new URLSearchParams({
        name,
        offset: offset.toString(),
      }).toString();

      const response = await fetch(`${this.BASE_URL}/api/patients?${query}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    } catch (error) {
      console.error("❌ Error fetching patients:", error);
      throw error;
    }
  }

  // ✅ Fetch a single patient by ID
  async getPatient(patientId: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch patient");
      return await response.json();
    } catch (error) {
      console.error("❌ Error fetching patient:", error);
      throw error;
    }
  }

  // ✅ Create a new patient
  async createPatient(patientData: object) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/patients`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(patientData),
      });

      if (!response.ok) throw new Error("Failed to create patient");
      return await response.json();
    } catch (error) {
      console.error("❌ Error creating patient:", error);
      throw error;
    }
  }

  // ✅ Update an existing patient
  async updatePatient(patientId: string, patientData: object) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(patientData),
      });

      if (!response.ok) throw new Error("Failed to update patient");
      return await response.json();
    } catch (error) {
      console.error("❌ Error updating patient:", error);
      throw error;
    }
  }

  // ✅ Delete a patient
  async deletePatient(patientId: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete patient");
      return await response.json();
    } catch (error) {
      console.error("❌ Error deleting patient:", error);
      throw error;
    }
  }
}

export default PatientService;