// types/medicScheduleTypes.ts

export interface WorkingDayHours {
    day: string;
    startTime: string;
    endTime: string;
  }
  
  export interface DayOff {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    repeatYearly: boolean;
  }
  