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

  // ✅ Singleton Pattern with Dynamic Credentials Update
  public static getInstance(token: string, clinicDb: string): ApiService {
    if (!this.instance) {
      this.instance = new ApiService(token, clinicDb);
    }
    return this.instance;
  }

  // ✅ Allow updating token & clinicDb dynamically
  public setCredentials(token: string, clinicDb: string): void {
    this.token = token;
    this.clinicDb = clinicDb;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "x-clinic-db": this.clinicDb,
    };
  }

  private async request<T>(
    method: RequestInit["method"], // ✅ Use built-in RequestInit["method"] for type safety
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
        let errorMessage: string;

        try {
          const errorJson = await response.json();
          errorMessage = errorJson?.message || JSON.stringify(errorJson);
        } catch {
          errorMessage = await response.text();
        }

        throw new Error(`API Error [${method} ${endpoint}]: ${errorMessage}`);
      }

      return response.status !== 204 ? (await response.json()) as T : (null as T);
    } catch (error) {
      console.error(`❌ API Request Failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // ✅ GET: Handles optional `id` & query parameters
  get<T>(resource: string, params: Record<string, string> = {}, id?: string): Promise<T> {
    const query = new URLSearchParams(params).toString();
    const endpoint = id ? `${resource}/${id}` : resource;
    return this.request("GET", `${endpoint}${query ? `?${query}` : ""}`);
  }

  post<T>(resource: string, data: unknown): Promise<T> {
    return this.request("POST", resource, data);
  }

  put<T>(resource: string, id: string, data: unknown): Promise<T> {
    return this.request("PUT", `${resource}/${id}`, data);
  }

  patch<T>(resource: string, id: string, data: unknown): Promise<T> {
    return this.request("PATCH", `${resource}/${id}`, data);
  }

  delete<T>(resource: string, id: string): Promise<T> {
    return this.request("DELETE", `${resource}/${id}`);
  }

  // ✅ Batch requests with enforced HTTP methods
  async batch<T>(requests: { method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; endpoint: string; body?: unknown }[]): Promise<T[]> {
    return this.post<T[]>("batch", { requests });
  }
}

export default ApiService;