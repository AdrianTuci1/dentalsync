import React, { useEffect, useState } from 'react';
import '../styles/components/calendar.scss';
import { Appointment } from '../types/appointmentEvent';
import SlotCardWithPopover from './SlotCardWithHoverCard';

interface CalendarProps {
  workingHoursStart: number;
  workingHoursEnd: number;
  appointments: Appointment[];
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const Calendar: React.FC<CalendarProps> = ({ workingHoursStart, workingHoursEnd, appointments }) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>(getCurrentWeekDates());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 300000); // Update every 5 minutes to keep the current time accurate
    return () => clearInterval(timer);
  }, []);

  const currentDayIndex = currentTime.getDay();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  return (
    <div className="calendar">
      <div className="body">
        <div className="days-content">
          <div className="header">
            <div className="time-header"></div>
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                className={`day-header ${index === currentDayIndex ? 'current-day' : ''}`}
              >
                <div>{day}</div>
                <div>{currentWeek[index].getDate()}</div>
              </div>
            ))}
          </div>
          <div className="slots">
            {Array.from({ length: workingHoursEnd - workingHoursStart + 1 }, (_, i) => workingHoursStart + i).map((hour, hourIndex) => (
              <div key={hourIndex} className="hour-row">
                <div className="time-slot">
                  {formatHour(hour)}
                </div>
                {daysOfWeek.map((_, dayIndex) => (
                  <div key={dayIndex} className="day-slot">
                    {appointments
                      .filter(appointment => appointment.day === dayIndex && appointment.startHour === hour)
                      .map((appointment, appointmentIndex) => (
                        <div key={appointmentIndex} className="event">
                          <SlotCardWithPopover
                            appointment={appointment}
                          />
                        </div>
                      ))}
                    {dayIndex === currentDayIndex && hour === currentHour && (
                      <div
                        className="current-time-line"
                        style={{ top: `${(currentMinutes / 60) * 100}%` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions to get the current week's dates and format them
function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today); // Clone the date object to avoid mutation
    date.setDate(startOfWeek + i);
    return date;
  });
  return dates;
}

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${hourFormatted}:00 ${period}`;
}

export default Calendar;
