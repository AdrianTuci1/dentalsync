import React, { useState, CSSProperties } from 'react';

interface ButtonSelectorProps {
  onSelect: (view: 'Week' | 'Day') => void; // Updated to 'Week' | 'Day'
}

const ButtonSelector: React.FC<ButtonSelectorProps> = ({ onSelect }) => {
  const [selectedButton, setSelectedButton] = useState<'Week' | 'Day'>('Week'); // Updated state

  const selectButton = (view: 'Week' | 'Day') => { // Updated to 'Week' | 'Day'
    setSelectedButton(view);
    onSelect(view); // Pass the selected view to the parent
  };

  const buttonStyle: CSSProperties = {
    padding: '7px 10px',
    margin: '5px',
    border: 'none',
    background: 'none',
    color: 'black',
    opacity: '0.6',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const selectedButtonStyle: CSSProperties = {
    ...buttonStyle,
    background: 'white',
    color: 'black',
    opacity: '1',
  };

  return (
    <div style={{ display: 'flex' }}>
      <button
        id="week"
        style={selectedButton === 'Week' ? selectedButtonStyle : buttonStyle} // Updated to 'Week'
        onClick={() => selectButton('Week')}
      >
        Week
      </button>
      <button
        id="day"
        style={selectedButton === 'Day' ? selectedButtonStyle : buttonStyle} // Updated to 'Day'
        onClick={() => selectButton('Day')}
      >
        Day
      </button>
    </div>
  );
};

export default ButtonSelector;
