const BASE_URL = `${import.meta.env.VITE_SERVER}/api/search`;

class SearchService {
  private subaccountToken: string;
  private database: string;

  constructor(subaccountToken: string, database: string) {
    this.subaccountToken = subaccountToken;
    this.database = database;
  }

  private async request(url: string, method: string, query: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.subaccountToken}`,  // Add the subaccount token
      'x-clinic-db': this.database,  // Add the database name with _db suffix
    };

    const options: RequestInit = {
      method,
      headers,
    };

    const response = await fetch(`${url}?query=${encodeURIComponent(query)}`, options);
    if (!response.ok) {
      throw new Error('Failed to process the request');
    }

    return response.json();
  }

  // Search Medics by query (name or email)
  async searchMedics(query: string) {
    return await this.request(`${BASE_URL}/medics`, 'GET', query);
  }

  // Search Patients by query (name or email)
  async searchPatients(query: string) {
    return await this.request(`${BASE_URL}/patients`, 'GET', query);
  }

  // Search Treartments by query (name)
  async searchTreatments(query: string) {
    return await this.request(`${BASE_URL}/treatments`, 'GET', query);
  }
}

export default SearchService;
