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
      medicColor: '#fe1d3c',
      treatmentType: 'Implant',
      reason: 'Needs a dental implant.',
      diagnosis: 'Missing teeth, bone loss',
      preferredPharmacy: ['Pharmacy A', 'Pharmacy B'],
      bookingDate: 'Thursday, 12 November, 09.00 AM - 10.00AM',
      appointmentType: 'Chat WhatsApp',
      date: new Date(2024, 8, 5),
      startHour: 9, // 9 AM
      endHour: 11,
      planningSchedule: [
        { time: '09:00', description: 'Implant Placement', doctor: 'Liz Adam', assistant: 'Nurse A', room: 'Room 1' },
        { time: '10:00', description: 'Post-Op Care', doctor: 'Liz Adam', assistant: 'Nurse B', room: 'Room 2' },
      ],
      status: 'finished',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientImage: '/avatar1.avif', // Update this to your actual image path
      email: 'jane@example.com',
      phone: '+987654321',
      medicName: 'Connor Luca',
      medicColor: '#ff5733',
      treatmentType: 'Root Canal',
      reason: 'Severe tooth pain.',
      diagnosis: 'Infected tooth pulp',
      preferredPharmacy: ['Pharmacy C'],
      bookingDate: 'Thursday, 12 November, 11.00 AM - 12.30PM',
      appointmentType: 'Video Call',
      date: new Date(2024, 8, 5),
      startHour: 9, // 11 AM
      endHour: 10, // 1 PM
      planningSchedule: [
        { time: '11:00', description: 'Root Canal Treatment', doctor: 'Tom Hanks', assistant: 'Nurse C', room: 'Room 3' },
        { time: '12:00', description: 'Medication', doctor: 'Tom Hanks', assistant: 'Nurse D', room: 'Room 4' },
      ],
      status: 'not-paid',
    },
    {
      id: '3',
      patientName: 'Alice Johnson',
      patientImage: '/avatar3.avif', // Update this to your actual image path
      email: 'alice@example.com',
      phone: '+1122334455',
      medicName: 'Ibram Har',
      medicColor: '#8e44ad',
      treatmentType: 'Teeth Whitening',
      reason: 'Cosmetic treatment.',
      diagnosis: 'Discolored teeth',
      preferredPharmacy: ['Pharmacy A'],
      bookingDate: 'Friday, 13 November, 02.00 PM - 03.00PM',
      appointmentType: 'In-Person',
      date: new Date(2024, 8, 3),
      startHour: 14, // 2 PM
      endHour: 15, // 3 PM
      planningSchedule: [
        { time: '14:00', description: 'Teeth Cleaning', doctor: 'Sara Connor', assistant: 'Nurse E', room: 'Room 2' },
        { time: '14:30', description: 'Whitening Procedure', doctor: 'Sara Connor', assistant: 'Nurse F', room: 'Room 1' },
      ],
      status: 'in-progress',
    },
    {
      id: '4',
      patientName: 'Bob Brown',
      patientImage: '/avatar3.avif', // Update this to your actual image path
      email: 'bob@example.com',
      phone: '+5566778899',
      medicName: 'Connor Luca',
      medicColor: '#1f2e5c',
      treatmentType: 'Braces Consultation',
      reason: 'Alignment issues.',
      diagnosis: 'Misaligned teeth',
      preferredPharmacy: ['Pharmacy B', 'Pharmacy C'],
      bookingDate: 'Monday, 16 November, 10.00 AM - 11.30AM',
      appointmentType: 'In-Person',
      date: new Date(2024, 8, 5),
      startHour: 10, // 10 AM
      endHour: 12, // 12 PM
      planningSchedule: [
        { time: '10:00', description: 'Consultation', doctor: 'Liz Adam', assistant: 'Nurse G', room: 'Room 1' },
        { time: '11:00', description: 'X-Ray', doctor: 'Liz Adam', assistant: 'Nurse H', room: 'Room 3' },
      ],
      status: 'registered',
    },
    {
      id: '5',
      patientName: 'Charlie Davis',
      patientImage: '/avatar3.avif', // Update this to your actual image path
      email: 'charlie@example.com',
      phone: '+9988776655',
      medicName: 'Ibram Har',
      medicColor: '#ff5733',
      treatmentType: 'Cavity Filling',
      reason: 'Tooth decay.',
      diagnosis: 'Cavity in molar',
      preferredPharmacy: ['Pharmacy D'],
      bookingDate: 'Wednesday, 11 November, 08.00 AM - 09.00AM',
      appointmentType: 'In-Person',
      date: new Date(2024, 8, 5),
      startHour: 9, // 8 AM
      endHour: 11, // 9 AM
      planningSchedule: [
        { time: '08:00', description: 'Filling Procedure', doctor: 'Tom Hanks', assistant: 'Nurse I', room: 'Room 2' },
      ],
      status: 'encounter',
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
