const BASE_URL = `${import.meta.env.VITE_SERVER}/api/search`;

class SearchService {
  private subaccountToken: string;
  private database: string;

  constructor(subaccountToken: string, database: string) {
    this.subaccountToken = subaccountToken;
    this.database = database;
  }

  // Generalized request handler
  private async request(
    endpoint: string,
    method: string,
    params: Record<string, string | number | null> = {}
  ) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.subaccountToken}`, // Add the subaccount token
      'x-clinic-db': this.database, // Add the database name
    };

    // Build the query string from params
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined) // Remove null/undefined
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('&');

    const options: RequestInit = {
      method,
      headers,
    };

    // Send the request
    const response = await fetch(`${endpoint}?${queryString}`, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process the request');
    }

    return response.json();
  }

  // Search Medics by query, date, time, and duration
  async searchMedics(query: string, date: string | null = null, time: string | null = null, duration: number | null = null, medicId: number | null = null) {
    const params = { query, date, time, duration, medicId };
    return await this.request(`${BASE_URL}/medics`, 'GET', params);
  }

  // Search Patients by query (name or email)
  async searchPatients(query: string) {
    const params = { query };
    return await this.request(`${BASE_URL}/patients`, 'GET', params);
  }

  // Search Treatments by query (name)
  async searchTreatments(query: string) {
    const params = { query };
    return await this.request(`${BASE_URL}/treatments`, 'GET', params);
  }
}

export default SearchService;
