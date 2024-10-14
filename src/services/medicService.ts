class MedicService {
    private subaccountToken: string;
    private database: string;
    private BASE_URL = import.meta.env.VITE_SERVER;
  
    constructor(subaccountToken: string, database: string) {
      this.subaccountToken = subaccountToken;
      this.database = database;
    }
  
    // Helper method to configure headers
    private getHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.subaccountToken}`,
        'x-clinic-db': this.database,
      };
    }
  
    // Create Medic
    async createMedic(medicData: object) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/medics`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(medicData),
        });
        return await response.json();
      } catch (error) {
        console.error('Error creating medic:', error);
        throw error;
      }
    }
  
    // View Medic
    async viewMedic(medicId: string) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/medics/${medicId}`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        return await response.json();
      } catch (error) {
        console.error('Error retrieving medic details:', error);
        throw error;
      }
    }
  
    // Update Medic
    async updateMedic(medicId: string, medicData: object) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/medics/${medicId}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(medicData),
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating medic:', error);
        throw error;
      }
    }
  
    // Delete Medic
    async deleteMedic(medicId: string) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/medics/${medicId}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        return await response.json();
      } catch (error) {
        console.error('Error deleting medic:', error);
        throw error;
      }
    }


      // Get Medics with Working Days
  async getMedicsWithWorkingDays() {
    try {
      const response = await fetch(`${this.BASE_URL}/api/medics`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching medics with working days:', error);
      throw error;
    }
  }
  }
  
  export default MedicService;
  