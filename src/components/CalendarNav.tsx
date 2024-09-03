import React, { useState, MouseEvent } from 'react';
import { Button, Popover } from '@mui/material';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarNavProps {
  currentMonth: string; // Add this prop to highlight the current month
  currentYear: number;
  onMonthYearChange: (month: string, year: number) => void;
}

const CalendarNav: React.FC<CalendarNavProps> = ({ currentMonth, currentYear, onMonthYearChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMonthClick = (month: string) => {
    onMonthYearChange(month, currentYear);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClick}>{`${currentMonth} ${currentYear}`}</Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: '10px' }}>
          {months.map((month, index) => (
            <Button
              key={index}
              onClick={() => handleMonthClick(month)}
              style={{
                backgroundColor: month === currentMonth ? '#1976d2' : 'transparent', // Highlight the current month
                color: month === currentMonth ? '#fff' : '#000',
              }}
            >
              {month}
            </Button>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default CalendarNav;
