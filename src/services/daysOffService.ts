// services/daysOffService.ts
import { DayOff } from "../types/medicScheduleTypes";

class DaysOffService {
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

  async getDaysOff(medicId: string): Promise<DayOff[]> {
    const response = await fetch(`${this.baseUrl}/api/days-off/${medicId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch days off');
    }

    const data = await response.json();
    return data;
  }

  async createDayOff(medicId: string, dayOff: DayOff): Promise<DayOff> {
    const response = await fetch(`${this.baseUrl}/api/days-off/${medicId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dayOff),
    });

    if (!response.ok) {
      throw new Error('Failed to create day off');
    }

    const data = await response.json();
    return data;
  }

  async updateDayOff(medicId: string, dayOffId: string, dayOff: Partial<DayOff>): Promise<DayOff> {
    const response = await fetch(`${this.baseUrl}/api/days-off/${medicId}/${dayOffId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(dayOff),
    });

    if (!response.ok) {
      throw new Error('Failed to update day off');
    }

    const data = await response.json();
    return data;
  }

  async deleteDayOff(medicId: string, dayOffId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/days-off/${medicId}/${dayOffId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete day off');
    }
  }
}

export default DaysOffService;
