import { useState } from 'react';
import Calendar from '../../components/Calendar'
import CustomMenu01 from '../../components/menus/CustomMenu01'
import '../../styles/windows/appointments.scss'
import ButtonSelector from '../../components/ButtonSelector';

function Appointments() {

  const [selectedButton, setSelectedButton] = useState<string>('');

  const handleButtonSelect = (buttonId: string) => {
    setSelectedButton(buttonId); // Update the parent's state with the selected button
  };

  const events = [
    { title: 'Meeting', day: 1, startHour: 10, endHour: 11 },
    { title: 'Lunch', day: 3, startHour: 12, endHour: 13 },
  ];

  return (
    <div style={{display:'flex', height:'calc(100vh - 60px)', width:'100%', overflow:'hidden'}}>
      <div className="specific-menu">
        <CustomMenu01 />
      </div>
      <div className="content-box">
        <div className="box">
            <div className="calendar-content">
              <div className="nav-part">

                  <div className="nav-button">
                    <img src="/calendar.png" alt="" style={{width:'20px'}}/>
                    <p>January 2024</p>
                    <button className='styled-button'><p>&lt;</p></button>
                    <button className='styled-button'><p>&gt;</p></button>
                  </div>

                <div className="second-part">
                  <div className="menu-type">
                    <ButtonSelector onSelect={handleButtonSelect} />
                  </div>
                  <button className='appointment-button'> <h2>+</h2>Add new Appointment</button>
                </div>
              </div>
            </div>
            <Calendar workingHoursStart={16} workingHoursEnd={24} events={events}/>
        </div>
      </div>
    </div>
  )
}

export default Appointments