import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Checkbox, FormControlLabel, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DentistIcon from '@mui/icons-material/Person';
import CalendarNav from './CalendarNav';
import DayNav from './DayNav';
import ButtonSelector from './ButtonSelector';

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  currentDate: Date;
  onMonthYearChange: (month: string, year: number) => void;
  onDateChange: (newDate: Date) => void;
  onSelectView: (view: 'Week' | 'Day') => void;
  selectedView: 'Week' | 'Day';
  onPrevClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  filters: { availableDoctors: { name: string; checked: boolean }[], treatmentTypes: { name: string; checked: boolean }[] };
  onFilterChange: (filterCategory: string, filterName: string, checked: boolean) => void;
  onDentistChange: (dentistName: string, checked: boolean) => void;
  onAllDentistClick: (allSelected: boolean) => void;
  toggleDrawer: (open: boolean) => void;
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
  onTodayClick,
  filters,
  onFilterChange,
  onDentistChange,
  onAllDentistClick,
  toggleDrawer,
}) => {
  const [dentistMenuAnchorEl, setDentistMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [allDentists, setAllDentists] = useState(true);

  // Open the dentist select menu
  const handleDentistClick = (event: React.MouseEvent<HTMLElement>) => {
    setDentistMenuAnchorEl(event.currentTarget);
  };

  // Close the dentist menu
  const handleDentistMenuClose = () => {
    setDentistMenuAnchorEl(null);
  };

  // Open the filters menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  // Close the filters menu
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  // Toggle the "All Dentists" option
  const handleAllDentistToggle = () => {
    const newAllDentistsValue = !allDentists;
    setAllDentists(newAllDentistsValue);
    onAllDentistClick(newAllDentistsValue);
  };

  // Prevent the dentist menu from closing while selecting/deselecting individual doctors
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', width:'100%' }}>
      {/* Left side: Total Appointments */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
                Add Patient
            </Button>
      </div>

      {/* Middle: Calendar/Day navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Back, Today, and Forward buttons */}
                <div style={{display: 'flex'}}>
                <IconButton onClick={onPrevClick} >
                  <ArrowBackIosIcon />
                </IconButton>

                <IconButton onClick={onTodayClick} style={{ marginLeft: '0px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'5px', fontSize:'16px'  }}>
                {selectedView === 'Week' ? (
                  <p>Current week</p>) :
                  (
                  <p>Today</p>
                  )}
                </IconButton>

                <IconButton onClick={onNextClick}>
                  <ArrowForwardIosIcon />
                </IconButton>
                </div>


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
        
        {/* ButtonSelector component */}
        <ButtonSelector onSelect={onSelectView} />
      </div>

      {/* Right side: Dentist Select and Filter */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Dentist Button that opens a menu */}
        <Button
          startIcon={<DentistIcon />}
          onClick={handleDentistClick}
        >
          {allDentists ? 'All Dentists' : 'Select Dentist'}
        </Button>

        {/* Dentist Menu */}
        <Menu
          anchorEl={dentistMenuAnchorEl}
          open={Boolean(dentistMenuAnchorEl)}
          onClose={handleDentistMenuClose}
        >
          <MenuItem onClick={handleAllDentistToggle}>
            <FormControlLabel
              control={<Checkbox checked={allDentists} />}
              label="All Dentists"
            />
          </MenuItem>
          {filters.availableDoctors.map((doctor, index) => (
            <MenuItem key={index} onClick={handleMenuItemClick}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={doctor.checked}
                    onChange={(event) => onDentistChange(doctor.name, event.target.checked)}
                  />
                }
                label={doctor.name}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* Filter button */}
        <IconButton aria-label="filter" onClick={handleFilterClick} style={{ marginLeft: '15px' }}>
          <FilterListIcon />
        </IconButton>

        {/* Treatment type filter menu */}
        <Menu
          anchorEl={filterMenuAnchorEl}
          open={Boolean(filterMenuAnchorEl)}
          onClose={handleFilterMenuClose}
          PaperProps={{
            style: {
              maxHeight: '400px',
              width: '250px',
              padding: '10px',
            },
          }}
        >
          {filters.treatmentTypes.map((treatment, index) => (
            <MenuItem key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={treatment.checked}
                    onChange={(event) => onFilterChange('treatmentTypes', treatment.name, event.target.checked)}
                  />
                }
                label={treatment.name}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default CalendarHeader;
