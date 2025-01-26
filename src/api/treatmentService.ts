import { Treatment } from "@/features/clinic/types/treatmentType";
import { saveOfflineData, getOfflineData } from "@/shared/utils/localForage";
import { queueOfflineEdit } from "@/shared/services/syncService";

const TREATMENTS_CACHE_KEY = "treatments_cache";

class TreatmentService {
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER; // Base server URL from Vite environment variable
  }

  // Headers for requests
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "x-clinic-db": this.clinicDb,
    };
  }

  /**
   * Create a new treatment with offline support.
   * - If offline, queue the creation for sync.
   */
  async createTreatment(treatmentData: Partial<Treatment>): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create treatment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Offline: Queuing treatment creation for sync");
      await queueOfflineEdit({
        endpoint: "/api/treatments",
        method: "POST",
        data: treatmentData,
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Fetch all treatments with offline caching.
   * - Serve cached data if available.
   * - Fetch fresh data in the background to update the cache.
   */
  async getAllTreatments(
    name: string = "",
    offset: number = 0
  ): Promise<{ treatments: Treatment[]; offset: number }> {
    try {
      // Try to serve cached data first
      const cachedTreatments = await getOfflineData<Treatment[]>(TREATMENTS_CACHE_KEY);
      if (cachedTreatments) {
        console.log("Serving cached treatments");
        // Fetch fresh data in the background while returning cached data
        this.fetchAndCacheTreatments(name, offset);
        return { treatments: cachedTreatments, offset };
      }
  
      // If no cached data, fetch fresh data
      return await this.fetchAndCacheTreatments(name, offset);
    } catch (cacheError) {
      console.warn("Error retrieving cached treatments, trying to fetch fresh data...", cacheError);
  
      // Fallback: Fetch fresh data if cache retrieval fails
      try {
        return await this.fetchAndCacheTreatments(name, offset);
      } catch (fetchError) {
        console.error("Error fetching treatments:", fetchError);
        throw new Error("Failed to fetch treatments, and no cached data available.");
      }
    }
  }
  

  /**
   * Get treatment by ID with fallback to offline data.
   */
  async getTreatmentById(treatmentId: string): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch treatment");
      }

      const data = await response.json();
      return data.treatment;
    } catch (error) {
      console.warn("Offline: Could not fetch treatment by ID");
      throw error;
    }
  }

  /**
   * Update a treatment with offline support.
   * - If offline, queue the update for sync.
   */
  async updateTreatment(
    treatmentId: string,
    treatmentData: Partial<Treatment>
  ): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(treatmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to update treatment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Offline: Queuing treatment update for sync");
      await queueOfflineEdit({
        endpoint: `/api/treatments/${treatmentId}`,
        method: "PUT",
        data: treatmentData,
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Delete a treatment with offline support.
   * - If offline, queue the deletion for sync.
   */
  async deleteTreatment(treatmentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/treatments/${treatmentId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete treatment");
      }
    } catch (error) {
      console.warn("Offline: Queuing treatment deletion for sync");
      await queueOfflineEdit({
        endpoint: `/api/treatments/${treatmentId}`,
        method: "DELETE",
        headers: this.getHeaders(),
      });
      throw error;
    }
  }

  /**
   * Fetch treatments from server and cache them in LocalForage.
   */
  private async fetchAndCacheTreatments(
    name: string = "",
    offset: number = 0
  ): Promise<{ treatments: Treatment[]; offset: number }> {
    const query = new URLSearchParams({
      name,
      offset: offset.toString(),
    }).toString();

    const response = await fetch(`${this.baseUrl}/api/treatments?${query}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch treatments");
    }

    const data = await response.json();
    await saveOfflineData(TREATMENTS_CACHE_KEY, data.treatments); // Cache treatments
    return { treatments: data.treatments, offset: data.offset };
  }
}

export default TreatmentService;