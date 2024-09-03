import { useState } from 'react';
import Calendar from '../../components/Calendar';
import DayView from '../../components/DayView';
import CalendarHeader from '../../components/CalendarHeader';
import { Appointment } from '../../types/appointmentEvent';  // Adjust the path according to your project structure

const getCurrentWeek = (date: Date): Date[] => {
  const startOfWeek = date.getDate() - date.getDay();
  return Array.from({ length: 7 }, (_, i) => new Date(date.getFullYear(), date.getMonth(), startOfWeek + i));
};

function Appointments() {
  const [selectedView, setSelectedView] = useState<'Week' | 'Day'>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek(new Date()));
  const [currentMonth, setCurrentMonth] = useState(currentDate.toLocaleString('default', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [filters, setFilters] = useState({
    availableDoctors: [
      { name: 'Liz Adam', checked: true },
      { name: 'Connor Luca', checked: true },
      { name: 'Ibram Har', checked: true },
      { name: 'Dominic Zima', checked: true },
      { name: 'Chris Luke', checked: true },
    ],
  });

  const handleMonthYearChange = (month: string, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    const newDate = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1);
    setCurrentDate(newDate);
    setCurrentWeek(getCurrentWeek(newDate));
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setCurrentMonth(newDate.toLocaleString('default', { month: 'long' }));
    setCurrentYear(newDate.getFullYear());
    setCurrentWeek(getCurrentWeek(newDate));
  };

  const handlePrevClick = () => {
    if (selectedView === 'Week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      handleDateChange(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      handleDateChange(newDate);
    }
  };

  const handleNextClick = () => {
    if (selectedView === 'Week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      handleDateChange(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      handleDateChange(newDate);
    }
  };

  const handleViewChange = (view: 'Week' | 'Day') => {
    setSelectedView(view);
  };

  const handleFilterChange = (filterName: string, checked: boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      availableDoctors: prevFilters.availableDoctors.map((doctor) =>
        doctor.name === filterName ? { ...doctor, checked } : doctor
      ),
    }));
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      patientImage: '/avatar2.avif', // Update this to your actual image path
      email: 'john@example.com',
      phone: '+123456789',
      medicName: 'Liz Adam',
      treatmentType: 'Implant',
      reason: 'Needs a dental implant.',
      diagnosis: 'Missing teeth, bone loss',
      preferredPharmacy: ['Pharmacy A', 'Pharmacy B'],
      bookingDate: 'Thursday, 12 November, 09.00 AM - 10.00AM',
      appointmentType: 'Chat WhatsApp',
      date: new Date(2024, 8, 3),
      startHour: 9, // 9 AM
      endHour: 11,
      planningSchedule: [
        { time: '09:00', description: 'Implant Placement', doctor: 'Liz Adam', assistant: 'Nurse A', room: 'Room 1' },
        { time: '10:00', description: 'Post-Op Care', doctor: 'Liz Adam', assistant: 'Nurse B', room: 'Room 2' },
      ],
      status: 'waiting',
    },
    // Add more appointments as needed
  ]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh -60px)', width: '100%', overflow: 'hidden' }}>
      <div className="content-box" style={{display:'flex', flexDirection:'column'}}>
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          currentDate={currentDate}
          onMonthYearChange={handleMonthYearChange}
          onDateChange={handleDateChange}
          onSelectView={handleViewChange}
          selectedView={selectedView}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {selectedView === 'Week' ? (
          <Calendar
            workingHoursStart={5}
            workingHoursEnd={14}
            appointments={appointments}
            currentWeek={currentWeek}
          />
        ) : (
          <DayView
            appointments={appointments}
            doctors={filters.availableDoctors.filter((doctor) => doctor.checked).map((doctor) => doctor.name)}
            currentDate={currentDate}
          />
        )}
      </div>
    </div>
  );
}

export default Appointments;
