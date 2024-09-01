import { useState } from 'react';
import Calendar from '../../components/Calendar'
import CustomMenu01 from '../../components/menus/CustomMenu01'
import '../../styles/windows/appointments.scss'
import { Appointment } from '../../types/appointmentEvent';
import CalendarHeader from '../../components/WindowHeader';
import Kanban from '../../components/Kanban';


const getCurrentWeek = (): Date[] => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay();
  return Array.from({ length: 7 }, (_, i) => new Date(today.setDate(startOfWeek + i)));
};


function Appointments() {
  const [selectedView, setSelectedView] = useState<'Calendar' | 'Kanban'>('Calendar');

  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());

  const handleMonthYearChange = (month: string, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const firstDayOfMonth = new Date(year, monthIndex, 1);
  
    const startOfWeek = firstDayOfMonth.getDate() - firstDayOfMonth.getDay(); 
    const newCurrentWeek = Array.from({ length: 7 }, (_, i) => new Date(year, monthIndex, startOfWeek + i));
    
    setCurrentWeek(newCurrentWeek);
  };

  const handlePreviousWeek = () => {
    const previousWeek = currentWeek.map((date) => new Date(date.setDate(date.getDate() - 7)));
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = currentWeek.map((date) => new Date(date.setDate(date.getDate() + 7)));
    setCurrentWeek(nextWeek);
  };

  const handleButtonSelect = (view: 'schedule' | 'kanban') => {
    const mappedView = view === 'schedule' ? 'Calendar' : 'Kanban';
    setSelectedView(mappedView);
  };

  const handleAddAppointment = () => {
    // Logic for adding a new appointment
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'waiting' | 'in-progress' | 'done') => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };


  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      patientImage: '/avatar2.avif',
      email: 'john@example.com',
      phone: '+123456789',
      medicName: 'Dr. Smith',
      treatmentType: 'Implant',
      reason: 'Needs a dental implant.',
      diagnosis: 'Missing teeth, bone loss',
      preferredPharmacy: ['Pharmacy A', 'Pharmacy B'],
      bookingDate: 'Thursday, 12 November, 09.00 AM - 10.00AM',
      appointmentType: 'Chat WhatsApp',
      date: new Date(2024, 8, 1),
      startHour: 9, // 9 AM
      endHour: 10,
      planningSchedule: [
        { time: '09:00', description: 'Implant Placement', doctor: 'Dr. Smith', assistant: 'Nurse A', room: 'Room 1' },
        { time: '10:00', description: 'Post-Op Care', doctor: 'Dr. Smith', assistant: 'Nurse B', room: 'Room 2' },
      ],
      status: 'waiting',
    },
    // Add more appointments as needed
  ]);



  return (
    <div style={{display:'flex', height:'calc(100vh - 60px)', width:'100%', overflow:'hidden'}}>
      <div className="specific-menu">
        <CustomMenu01 />
      </div>
      <div className="content-box">
        <div className="box">
            <CalendarHeader 
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthYearChange={handleMonthYearChange}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onSelect={handleButtonSelect}
            onAddAppointment={handleAddAppointment}
            />
            {selectedView === 'Calendar' ? (
              <Calendar 
                workingHoursStart={5} 
                workingHoursEnd={14} 
                appointments={appointments}
                currentWeek={currentWeek}
              />
            ) : (
              <Kanban 
              appointments={appointments} 
              onStatusChange={handleStatusChange}
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default Appointments