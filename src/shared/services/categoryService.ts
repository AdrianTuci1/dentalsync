class CategoryService {
    private baseUrl: string;
    private clinicDb: string;
  
    constructor(clinicDb: string) {
      this.baseUrl = import.meta.env.VITE_SERVER; // Set this in your .env file
      this.clinicDb = clinicDb;
    }
  
    // Get all categories
    async getCategories() {
      try {
        const response = await fetch(`${this.baseUrl}/api/category`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-clinic-db': this.clinicDb,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error in getCategories:', error);
        throw error;
      }
    }
  
    // Create a new category
    async createCategory(name: string) {
      try {
        const response = await fetch(`${this.baseUrl}/api/category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-clinic-db': this.clinicDb,
          },
          body: JSON.stringify({ name }),
        });
        if (!response.ok) {
          throw new Error(`Error creating category: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error in createCategory:', error);
        throw error;
      }
    }
  
    // Delete a category by ID
    async deleteCategory(categoryId: string) {
      try {
        const response = await fetch(`${this.baseUrl}/api/category/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-clinic-db': this.clinicDb,
          },
        });
        if (!response.ok) {
          throw new Error(`Error deleting category: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error in deleteCategory:', error);
        throw error;
      }
    }
  }
  
  export default CategoryService;
  