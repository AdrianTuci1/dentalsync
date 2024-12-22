class DentalHistoryService {
    private baseUrl: string;
    private clinicDb: string;
  
    constructor(clinicDb: string) {
      this.baseUrl = import.meta.env.VITE_SERVER; // Set this in your .env file
      this.clinicDb = clinicDb;
    }
  
    // Fetch dental history for a patient
    async getDentalHistory(patientId: string) {
      try {
        const response = await fetch(`${this.baseUrl}/api/dentalHistory/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-clinic-db": this.clinicDb, // Pass the clinic database dynamically
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching dental history: ${response.statusText}`);
        }
  
        return await response.json(); // Parse JSON response
      } catch (error) {
        console.error("Error in getDentalHistory:", error);
        throw error;
      }
    }
  
    // Bulk patch dental history (already implemented)
    async bulkPatchDentalHistory(patientId: string, teethUpdates: any[]) {
      try {
        const response = await fetch(`${this.baseUrl}/api/dentalHistory/bulkPatch`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-clinic-db": this.clinicDb,
          },
          body: JSON.stringify({ patientId, teethUpdates }),
        });
  
        if (!response.ok) {
          throw new Error(`Error patching dental history: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error("Error in bulkPatchDentalHistory:", error);
        throw error;
      }
    }
  }
  
  export default DentalHistoryService;
  