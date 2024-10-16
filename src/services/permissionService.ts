// services/permissionService.ts
import { Permission } from "../types/permissionType";

class PermissionService {
  private token: string;
  private clinicDb: string;
  private baseUrl: string;

  constructor(token: string, clinicDb: string) {
    this.token = token;
    this.clinicDb = clinicDb;
    this.baseUrl = import.meta.env.VITE_SERVER;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'x-clinic-db': this.clinicDb,
    };
  }

  // Get permissions for a specific user
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const response = await fetch(`${this.baseUrl}/api/permissions/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user permissions');
    }

    const data = await response.json();
    // Assuming each permission comes with an "isEnabled" field
    return data.permissions.map((permission: any) => ({
      id: permission.id,
      name: permission.name,
      isEnabled: permission.ClinicUserPermission.isEnabled,
    }));
  }

  // Update permissions for a specific user
  async updateUserPermissions(userId: string, permissions: Permission[]): Promise<void> {
    const payload = permissions.map((perm) => ({
      permissionId: perm.id,
      isEnabled: perm.isEnabled,
    }));

    const response = await fetch(`${this.baseUrl}/api/permissions/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ permissions: payload }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user permissions');
    }
  }
}

export default PermissionService;
