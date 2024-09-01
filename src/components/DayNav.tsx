import React, { useState, MouseEvent } from 'react';
import { Button, Popover } from '@mui/material';

interface DayNavProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

const DayNav: React.FC<DayNavProps> = ({ currentDate, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateChange(newDate);
    handleClose();
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  return (
    <div>
      <Button onClick={handleClick}>
        {`${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })}`}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: '10px' }}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
            <Button key={day} onClick={() => handleDayClick(day)} style={{ minWidth: '36px' }}>
              {day}
            </Button>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default DayNav;
