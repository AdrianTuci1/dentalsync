import React, { useEffect, useState } from 'react';
import '../styles/components/calendar.scss';
import { Appointment } from '../types/appointmentEvent';
import SlotCardWithPopover from './SlotCardWithHoverCard';

interface CalendarProps {
  workingHoursStart: number;
  workingHoursEnd: number;
  appointments: Appointment[];
  currentWeek: Date[];
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const Calendar: React.FC<CalendarProps> = ({ workingHoursStart, workingHoursEnd, appointments, currentWeek }) => {
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
                className={`day-header ${currentWeek[index].getDay() === currentDayIndex ? 'current-day' : ''}`}
              >
                <div>{day}</div>
                <div>{currentWeek[index].getDate()}</div> {/* Displaying the date for each day in the current week */}
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
                      .filter(appointment => 
                        appointment.date.toDateString() === currentWeek[dayIndex].toDateString() &&
                        appointment.startHour === hour
                      )
                      .map((appointment, appointmentIndex) => (
                        <div key={appointmentIndex} className="event">
                          <SlotCardWithPopover
                            appointment={appointment}
                          />
                        </div>
                      ))}
                    {currentWeek[dayIndex].getDay() === currentDayIndex && hour === currentHour && (
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

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${hourFormatted}:00 ${period}`;
}

export default Calendar;
