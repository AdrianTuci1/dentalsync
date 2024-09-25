import React, { useState, useEffect } from 'react';
import { isSameDay, isSameWeek } from 'date-fns';

interface CustomDatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const today = new Date();

  useEffect(() => {
    // Update currentMonth when selectedDate changes
    setCurrentMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    );
  }, [selectedDate]);

  // Generate array of dates for the current month
  const generateMonthDays = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const weekDayOffset = firstDay.getDay();

    const days = [];
    for (let i = 1; i <= daysInMonth + weekDayOffset; i++) {
      if (i > weekDayOffset) {
        days.push(
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            i - weekDayOffset
          )
        );
      } else {
        days.push(null); // Add null values for empty spaces before the start of the month
      }
    }
    return days;
  };

  // Navigate months and years
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day: Date | null) => {
    if (day) {
      onSelectDate(day);
      setShowCalendar(false); // Close the calendar after selecting a date
    }
  };

  // Generate months for the second column
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(currentMonth.getFullYear(), i, 1)
    );
  };

  const handleMonthClick = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
  };

  // Helper function to check if a date is in the selected week
  const isDateInSelectedWeek = (date: Date) => {
    return isSameWeek(date, selectedDate);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Button to open the calendar */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          border: '1px solid #ccc',
        }}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <span style={{ marginRight: '8px' }}>📅</span>
        {selectedDate.toDateString()}
      </button>

      {/* Dropdown calendar */}
      {showCalendar && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: 'white',
            zIndex: 1000,
            display: 'flex',
          }}
        >
          {/* Days of the Month */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <button onClick={handlePrevMonth}>◀</button>
              <span>
                {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
                {currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth}>▶</button>
            </div>

            {/* Days of the week */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '5px',
              }}
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <span
                  key={day}
                  style={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                  {day}
                </span>
              ))}

              {/* Days of the current month */}
              {generateMonthDays().map((day, index) => {
                const isTodayDay = day && isSameDay(day, today);
                const isInSelectedWeek = day && isDateInSelectedWeek(day);

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    style={{
                      padding: '10px',
                      backgroundColor: isTodayDay
                        ? '#1976d2' // Background color for today
                        : isInSelectedWeek
                        ? '#e3f2fd' // Background color for selected week
                        : day
                        ? '#f5f5f5' // Default day color
                        : 'transparent',
                      color: isTodayDay
                        ? '#fff' // Text color for today
                        : day
                        ? '#000'
                        : 'transparent',
                      border: 'none',
                      cursor: day ? 'pointer' : 'default',
                    }}
                    disabled={!day}
                  >
                    {day ? day.getDate() : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Months Column */}
          <div style={{ marginLeft: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <strong>{currentMonth.getFullYear()}</strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '5px',
              }}
            >
              {generateMonths().map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthClick(month.getMonth())}
                  style={{
                    padding: '10px',
                    backgroundColor:
                      month.getMonth() === currentMonth.getMonth()
                        ? '#1976d2'
                        : '#f5f5f5',
                    color:
                      month.getMonth() === currentMonth.getMonth()
                        ? '#fff'
                        : '#000',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {month.toLocaleString('default', { month: 'short' })}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
