
import '../styles/multiMonthCalendar.scss';

// MultiMonthCalendar.tsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface MultiMonthCalendarProps {
  onDateChange: (date: Date) => void;
  selectedDate: Date | null;
}

const MultiMonthCalendar: React.FC<MultiMonthCalendarProps> = ({ onDateChange, selectedDate }) => {
  const today = new Date();

  // Define unavailable dates
  const unavailableDates = [
    new Date(today.getFullYear(), today.getMonth(), 5),
    new Date(today.getFullYear(), today.getMonth(), 10),
    new Date(today.getFullYear(), today.getMonth(), 15),
    // Add more dates as needed
  ];

  const isDateDisabled = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getFullYear() === date.getFullYear() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getDate() === date.getDate()
    );
  };

  const renderMonthCalendar = (monthOffset: number) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return (
      <Calendar
        value={selectedDate}
        onClickDay={(date) => onDateChange(date)}
        tileDisabled={({ date }) => isDateDisabled(date)}
        activeStartDate={monthDate}
        view="month"
        showNeighboringMonth={false}
        showNavigation={false} // Hide month navigation completely
        className="custom-calendar"
      />
    );
  };

  return (
    <div className="multi-month-calendar">
      <div className="calendar-container">
        <div className="calendar-month">
          <p>{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          {renderMonthCalendar(0)}
        </div>
        <div className="calendar-month">
          <p>{new Date(today.getFullYear(), today.getMonth() + 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          {renderMonthCalendar(1)}
        </div>
        <div className="calendar-month">
          <p>{new Date(today.getFullYear(), today.getMonth() + 2, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          {renderMonthCalendar(2)}
        </div>
      </div>
    </div>
  );
};

export default MultiMonthCalendar;
