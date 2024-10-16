// services/workingDaysHoursService.ts
import { WorkingDayHours } from "../types/medicScheduleTypes";

class WorkingDaysHoursService {
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

  async getWorkingDaysHours(medicId: string): Promise<WorkingDayHours[]> {
    const response = await fetch(`${this.baseUrl}/api/working-days-hours/${medicId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch working days and hours');
    }

    const data = await response.json();
    return data;
  }

  async createWorkingDayHours(medicId: string, dayHours: WorkingDayHours): Promise<WorkingDayHours> {
    const response = await fetch(`${this.baseUrl}/api/working-days-hours/${medicId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dayHours),
    });

    if (!response.ok) {
      throw new Error('Failed to create working day hours');
    }

    const data = await response.json();
    return data;
  }

  async updateWorkingDayHours(medicId: string, day: string, dayHours: Partial<WorkingDayHours>): Promise<WorkingDayHours> {
    const response = await fetch(`${this.baseUrl}/api/working-days-hours/${medicId}/${day}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(dayHours),
    });

    if (!response.ok) {
      throw new Error('Failed to update working day hours');
    }

    const data = await response.json();
    return data;
  }

  async deleteWorkingDayHours(medicId: string, day: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/working-days-hours/${medicId}/${day}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete working day hours');
    }
  }
}

export default WorkingDaysHoursService;
