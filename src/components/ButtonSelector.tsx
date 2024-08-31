import React, { useState, CSSProperties } from 'react';

interface ButtonSelectorProps {
  onSelect: (selectedButton: string) => void;
}

const ButtonSelector: React.FC<ButtonSelectorProps> = ({ onSelect }) => {
  const [selectedButton, setSelectedButton] = useState<string>('button1');

  const selectButton = (buttonId: string) => {
    setSelectedButton(buttonId);
    onSelect(buttonId); // Pass the selected button ID to the parent
  };

  const buttonStyle: CSSProperties = {
    padding: '7px 10px',
    margin: '5px',
    border: 'none',
    background:'none',
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
        id="button1"
        style={selectedButton === 'button1' ? selectedButtonStyle : buttonStyle}
        onClick={() => selectButton('button1')}
      >
        Schedule
      </button>
      <button
        id="button2"
        style={selectedButton === 'button2' ? selectedButtonStyle : buttonStyle}
        onClick={() => selectButton('button2')}
      >
        Kaban
      </button>
    </div>
  );
};

export default ButtonSelector;
