import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import Button from '@mui/material/Button';
import ButtonSelector from './ButtonSelector';

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  onMonthYearChange: (month: string, year: number) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onSelect: (view: 'schedule' | 'kanban') => void;
  onAddAppointment: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onMonthYearChange,
  onPreviousWeek,
  onNextWeek,
  onSelect,
  onAddAppointment,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    onMonthYearChange(month, selectedYear);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onMonthYearChange(selectedMonth, year);
  };

  return (
    <div className="calendar-content" style={{margin:'10px'}}>
      <div className="nav-part">
        <div className="nav-button">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="contained" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img src="/calendar.png" alt="Calendar" style={{ width: '20px' }} />
                <p>{`${selectedMonth} ${selectedYear}`}</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={5}
              style={{
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                zIndex: 14,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={() => handleYearChange(selectedYear - 1)}>-</Button>
                  <p>{selectedYear}</p>
                  <Button variant="outlined" onClick={() => handleYearChange(selectedYear + 1)}>+</Button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  {months.map((month) => (
                    <Button
                      key={month}
                      variant={month === selectedMonth ? 'contained' : 'outlined'}
                      onClick={() => handleMonthChange(month)}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button className="styled-button" onClick={onPreviousWeek}>
            &lt;
          </Button>
          <Button className="styled-button" onClick={onNextWeek}>
            &gt;
          </Button>
        </div>

        <div className="second-part">
          <div className="menu-type">
            <ButtonSelector onSelect={onSelect} />
          </div>
          <Button variant="contained" className="appointment-button" onClick={onAddAppointment}>
            <h2>+</h2>Add new Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;

