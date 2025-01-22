class PatientService {
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
    
    // Fetch patients with optional search and offset
    async getPatients(name = '', offset = 0) {
      try {
        const query = new URLSearchParams({
          name,
          offset: offset.toString(), // Convert number to string
        }).toString(); // Build the query string

        const response = await fetch(`${this.BASE_URL}/api/patients?${query}`, {
          method: 'GET',
          headers: this.getHeaders(),
        });

        return await response.json();
      } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
    }

  
    // Create a new patient
    async createPatient(patientData: object) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/patients`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(patientData),
        });
        return await response.json();
      } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
    }
  
    // Update an existing patient
    async updatePatient(patientId: string, patientData: object) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(patientData),
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
    }
  
    // Delete a patient
    async deletePatient(patientId: string) {
      try {
        const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        return await response.json();
      } catch (error) {
        console.error('Error deleting patient:', error);
        throw error;
      }
    }


      // Method to get a patient by ID
  async getPatient(patientId: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/patients/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }
  }
  
  export default PatientService;
  