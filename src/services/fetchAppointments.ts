const BASE_URL = `${import.meta.env.VITE_SERVER}/api/appointments`;

class AppointmentService {
  private subaccountToken: string;
  private database: string;

  constructor(subaccountToken: string, database: string) {
    this.subaccountToken = subaccountToken;
    this.database = database;
  }

  private async request(url: string, method: string, body?: any) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.subaccountToken}`,  // Add the subaccount token
      'x-clinic-db': this.database,  // Add the database name with _db suffix
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to process the request');
    }

    return response.json();
  }

  // Fetch Full Appointment Details
  async fetchAppointment(appointmentId: string) {
    return await this.request(`${BASE_URL}/${appointmentId}`, 'GET');
  }

  // Create a New Appointment
  async createAppointment(appointmentData: any) {
    return await this.request(`${BASE_URL}`, 'POST', appointmentData);
  }

  // Delete an Appointment by ID
  async deleteAppointment(appointmentId: string) {
    return await this.request(`${BASE_URL}/${appointmentId}`, 'DELETE');
  }

  // Edit an Existing Appointment by ID
  async editAppointment(appointmentId: string, updatedData: any) {
    return await this.request(`${BASE_URL}/${appointmentId}`, 'PUT', updatedData);
  }
}

export default AppointmentService;
