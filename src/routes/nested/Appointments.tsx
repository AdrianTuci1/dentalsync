import { useState } from 'react';
import Calendar from '../../components/Calendar';
import CustomMenu01 from '../../components/menus/CustomMenu01';
import '../../styles/windows/appointments.scss';
import { Appointment } from '../../types/appointmentEvent';
import CalendarHeader from '../../components/CalendarHeader';  // Ensure this is the correct import path
import DayView from '../../components/DayView';

const getCurrentWeek = (): Date[] => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay();
  return Array.from({ length: 7 }, (_, i) => new Date(today.setDate(startOfWeek + i)));
};

function Appointments() {
  const [selectedView, setSelectedView] = useState<'Week' | 'Day'>('Week');
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]); 

  const handleMonthYearChange = (month: string, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);

    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const firstDayOfMonth = new Date(year, monthIndex, 1);

    const startOfWeek = firstDayOfMonth.getDate() - firstDayOfMonth.getDay();
    const newCurrentWeek = Array.from({ length: 7 }, (_, i) => new Date(year, monthIndex, startOfWeek + i));

    setCurrentWeek(newCurrentWeek);
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setCurrentMonth(newDate.toLocaleString('default', { month: 'long' }));
    setCurrentYear(newDate.getFullYear());

    const startOfWeek = newDate.getDate() - newDate.getDay();
    const newCurrentWeek = Array.from({ length: 7 }, (_, i) => new Date(newDate.setDate(startOfWeek + i)));

    setCurrentWeek(newCurrentWeek);
  };

  const handleViewChange = (view: 'Week' | 'Day') => {
    setSelectedView(view);
  };

  const handleAddAppointment = () => {
    // Logic for adding a new appointment
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      patientImage: '/avatar2.avif',
      email: 'john@example.com',
      phone: '+123456789',
      medicName: 'Liz Adam',
      treatmentType: 'Implant',
      reason: 'Needs a dental implant.',
      diagnosis: 'Missing teeth, bone loss',
      preferredPharmacy: ['Pharmacy A', 'Pharmacy B'],
      bookingDate: 'Thursday, 12 November, 09.00 AM - 10.00AM',
      appointmentType: 'Chat WhatsApp',
      date: new Date(2024, 8, 2),
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
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', width: '100%', overflow: 'hidden' }}>
      <div className="specific-menu">
        <CustomMenu01 onDoctorsChange={setSelectedDoctors} />
      </div>
      <div className="content-box">
        <div className="box">
          <CalendarHeader
            currentMonth={currentMonth}
            currentYear={currentYear}
            currentDate={currentDate}
            onMonthYearChange={handleMonthYearChange}
            onDateChange={handleDateChange}
            onSelectView={handleViewChange}
            selectedView={selectedView}
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
            doctors={selectedDoctors} 
            currentDate={currentDate}
          />
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
