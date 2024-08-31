import React, { useState, useRef } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import SlotCard from './SlotCard';
import PatientPopoverContent from './PatientPopoverContent';
import { Appointment } from '../types/appointmentEvent';

interface SlotCardWithPopoverProps {
  appointment: Appointment;
}

const SlotCardWithPopover: React.FC<SlotCardWithPopoverProps> = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 300); // Adjust the delay (in milliseconds) as needed
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ display: 'inline-block' }}
        >
          <SlotCard appointment={appointment} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        side="right"
        align="start"
        sideOffset={5}
        style={{
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          maxWidth: '380px',
          zIndex: '10',
        }}
      >
        <PatientPopoverContent appointment={appointment} />
      </PopoverContent>
    </Popover>
  );
};

export default SlotCardWithPopover;

