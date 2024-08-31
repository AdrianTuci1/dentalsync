import React from 'react';
import ButtonSelector from './ButtonSelector'; // Adjust the path as necessary

interface CalendarHeaderProps {
  onSelect: (buttonId: string) => void;
}

const WindowHeader: React.FC<CalendarHeaderProps> = ({ onSelect }) => {
  return (
    <div className="calendar-content">
      <div className="nav-part">
        <div className="nav-button">
          <img src="/calendar.png" alt="Calendar" style={{ width: '20px' }} />
          <p>January 2024</p>
          <button className="styled-button">
            <p>&lt;</p>
          </button>
          <button className="styled-button">
            <p>&gt;</p>
          </button>
        </div>
        <div className="second-part">
          <div className="menu-type">
            <ButtonSelector onSelect={onSelect} />
          </div>
          <button className="appointment-button">
            <h2>+</h2>Add new Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowHeader;
