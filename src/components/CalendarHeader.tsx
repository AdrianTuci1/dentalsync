import React from 'react';
import ButtonSelector from './ButtonSelector';
import CalendarNav from './CalendarNav'; // Ensure this is imported
import DayNav from './DayNav'; // Ensure this is imported

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  currentDate: Date;
  onMonthYearChange: (month: string, year: number) => void;
  onDateChange: (newDate: Date) => void;
  onSelectView: (view: 'Week' | 'Day') => void;
  selectedView: 'Week' | 'Day';
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  currentDate,
  onMonthYearChange,
  onDateChange,
  onSelectView,
  selectedView
}) => {
  const handleSelectView = (view: 'Week' | 'Day') => {
    onSelectView(view);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
      <div>
        {selectedView === 'Week' ? (
          <CalendarNav
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthYearChange={onMonthYearChange}
          />
        ) : (
          <DayNav
            currentDate={currentDate}
            onDateChange={onDateChange}
          />
        )}
      </div>
      <div>
        <ButtonSelector onSelect={handleSelectView} />
      </div>
    </div>
  );
};

export default CalendarHeader;
