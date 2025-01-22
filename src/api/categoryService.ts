class CategoryService {
  private baseUrl: string;
  private clinicDb: string;

  constructor(clinicDb: string) {
    this.baseUrl = import.meta.env.VITE_SERVER; // Server URL from .env file
    this.clinicDb = clinicDb;
  }

  // Fetch all unique categories
  async getAllCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Clinic-Db': this.clinicDb, // Pass clinicDb to the backend
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }

      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  }

  // Fetch filtered categories based on search query
  async getFilteredCategories(search: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/categories/look?search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Clinic-Db': this.clinicDb, // Pass clinicDb to the backend
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching filtered categories: ${response.statusText}`);
      }

      const filteredCategories = await response.json();
      return filteredCategories;
    } catch (error) {
      console.error('Error in getFilteredCategories:', error);
      throw error;
    }
  }
}

export default CategoryService;