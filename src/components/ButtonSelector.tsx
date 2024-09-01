import React, { useState, CSSProperties } from 'react';

interface ButtonSelectorProps {
  onSelect: (view: 'schedule' | 'kanban') => void;
}

const ButtonSelector: React.FC<ButtonSelectorProps> = ({ onSelect }) => {
  const [selectedButton, setSelectedButton] = useState<'schedule' | 'kanban'>('schedule');

  const selectButton = (view: 'schedule' | 'kanban') => {
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
    <div>
      <button
        id="schedule"
        style={selectedButton === 'schedule' ? selectedButtonStyle : buttonStyle}
        onClick={() => selectButton('schedule')}
      >
        Schedule
      </button>
      <button
        id="kanban"
        style={selectedButton === 'kanban' ? selectedButtonStyle : buttonStyle}
        onClick={() => selectButton('kanban')}
      >
        Kanban
      </button>
    </div>
  );
};

export default ButtonSelector;
