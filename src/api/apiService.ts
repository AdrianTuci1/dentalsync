// src/api/services/apiService.ts
class ApiService {
    private static instance: ApiService;
    private token: string;
    private clinicDb: string;
    private baseUrl: string;
  
    private constructor(token: string, clinicDb: string) {
      this.token = token;
      this.clinicDb = clinicDb;
      this.baseUrl = import.meta.env.VITE_SERVER; // Ensure VITE_SERVER is set in your .env
    }
  
    public static getInstance(token: string, clinicDb: string): ApiService {
      if (!this.instance) {
        this.instance = new ApiService(token, clinicDb);
      }
      return this.instance;
    }
  
    private getHeaders(): HeadersInit {
      return {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "x-clinic-db": this.clinicDb,
      };
    }
  
    private async request<T>(
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      endpoint: string,
      body?: unknown
    ): Promise<T> {
      try {
        const response = await fetch(`${this.baseUrl}/api/${endpoint}`, {
          method,
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`API Error [${method} ${endpoint}]: ${errorMessage}`);
        }
  
        return response.status !== 204 ? (await response.json()) as T : (null as T);
      } catch (error) {
        console.error(`❌ API Request Failed: ${method} ${endpoint}`, error);
        throw error;
      }
    }
  
    get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
      const query = new URLSearchParams(params).toString();
      return this.request("GET", `${endpoint}${query ? `?${query}` : ""}`);
    }
  
    post<T>(endpoint: string, data: unknown): Promise<T> {
      return this.request("POST", endpoint, data);
    }
  
    put<T>(endpoint: string, data: unknown): Promise<T> {
      return this.request("PUT", endpoint, data);
    }
  
    patch<T>(endpoint: string, data: unknown): Promise<T> {
      return this.request("PATCH", endpoint, data);
    }
  
    delete<T>(endpoint: string): Promise<T> {
      return this.request("DELETE", endpoint);
    }
  
    // Batch requests: send an array of requests in one call
    async batch<T>(requests: { method: string; endpoint: string; body?: unknown }[]): Promise<T[]> {
      return this.post<T[]>("batch", { requests });
    }
  }
  
  export default ApiService;