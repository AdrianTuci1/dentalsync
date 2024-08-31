import { useState } from 'react';
import Calendar from '../../components/Calendar'
import CustomMenu01 from '../../components/menus/CustomMenu01'
import '../../styles/windows/appointments.scss'
import { Appointment } from '../../types/appointmentEvent';
import WindowHeader from '../../components/WindowHeader';

function Appointments() {

  const [selectedButton, setSelectedButton] = useState<string>('');

  const [appointments] = useState<Appointment[]>([
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
      day: 3, // Thursday
      startHour: 9, // 9 AM
      endHour: 10,
      planningSchedule: [
        { time: '09:00', description: 'Implant Placement', doctor: 'Dr. Smith', assistant: 'Nurse A', room: 'Room 1' },
        { time: '10:00', description: 'Post-Op Care', doctor: 'Dr. Smith', assistant: 'Nurse B', room: 'Room 2' },
      ],
    },
    // Add more appointments as needed
  ]);

  const handleButtonSelect = (buttonId: string) => {
    setSelectedButton(buttonId); // Update the parent's state with the selected button
  };
  

  return (
    <div style={{display:'flex', height:'calc(100vh - 60px)', width:'100%', overflow:'hidden'}}>
      <div className="specific-menu">
        <CustomMenu01 />
      </div>
      <div className="content-box">
        <div className="box">
            <WindowHeader onSelect={handleButtonSelect}/>
            <Calendar workingHoursStart={5} workingHoursEnd={14} appointments={appointments}/>
        </div>
      </div>
    </div>
  )
}

export default Appointments