import React, { useEffect, useState } from 'react';
import '../styles/scheduleIndicator.scss';

// Define the type for the clinic schedule
type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

const clinicSchedule: Record<Weekday, { open: string; close: string } | null> = {
  Monday: { open: '09:00', close: '18:00' },
  Tuesday: { open: '09:00', close: '18:00' },
  Wednesday: { open: '09:00', close: '18:00' },
  Thursday: { open: '09:00', close: '18:00' },
  Friday: { open: '09:00', close: '18:00' },
  Saturday: { open: '10:00', close: '14:00' },
  Sunday: null, // Closed
};

const ScheduleIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }) as Weekday;
      const currentTime = now.toTimeString().slice(0, 5);

      const schedule = clinicSchedule[dayName];

      if (schedule) {
        setIsOpen(currentTime >= schedule.open && currentTime < schedule.close);
      } else {
        setIsOpen(false); // Closed
      }
    };

    checkOpenStatus();

    // Optional: Update status every minute
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="schedule-indicator">
      <span className={`status-dot ${isOpen ? 'open' : 'closed'}`} />
    </div>
  );
};

export default ScheduleIndicator;