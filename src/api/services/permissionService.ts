import { ApiPermission } from "@/features/clinic/types/Medic";

class PermissionService {
  private subaccountToken: string;
  private database: string;
  private BASE_URL = import.meta.env.VITE_SERVER;

  constructor(subaccountToken: string, database: string) {
    this.subaccountToken = subaccountToken;
    this.database = database;
  }

  // Fetch all permissions
  async getAllPermissions(): Promise<ApiPermission[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/permissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.subaccountToken}`, // Optional, if permissions are secured
          'x-clinic-db': this.database,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }
}

export default PermissionService;