import React, { useState } from 'react';
import ButtonSelector from './ButtonSelector';
import CalendarNav from './CalendarNav';
import DayNav from './DayNav';
import { IconButton, Menu, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  currentDate: Date;
  onMonthYearChange: (month: string, year: number) => void;
  onDateChange: (newDate: Date) => void;
  onSelectView: (view: 'Week' | 'Day') => void;
  selectedView: 'Week' | 'Day';
  onPrevClick: () => void; // Add function to handle previous navigation
  onNextClick: () => void; // Add function to handle next navigation
  filters: { availableDoctors: { name: string; checked: boolean }[] };  // Add this prop for filters
  onFilterChange: (filterName: string, checked: boolean) => void;  // Function to handle filter changes
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  currentDate,
  onMonthYearChange,
  onDateChange,
  onSelectView,
  selectedView,
  onPrevClick,
  onNextClick,
  filters,
  onFilterChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectView = (view: 'Week' | 'Day') => {
    onSelectView(view);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onPrevClick}>
          <ArrowBackIosIcon />
        </IconButton>
        
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

        <IconButton onClick={onNextClick}>
          <ArrowForwardIosIcon />
        </IconButton>

        <IconButton aria-label="filter" onClick={handleFilterClick} style={{ marginLeft: '15px' }}>
          <FilterListIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: '400px',
              width: '250px',
              padding: '10px',
            },
          }}
        >
          {filters.availableDoctors.map((doctor, index) => (
            <MenuItem key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={doctor.checked}
                    onChange={(event) => onFilterChange(doctor.name, event.target.checked)}
                  />
                }
                label={doctor.name}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div>
        <ButtonSelector onSelect={handleSelectView} />
      </div>
    </div>
  );
};

export default CalendarHeader;
