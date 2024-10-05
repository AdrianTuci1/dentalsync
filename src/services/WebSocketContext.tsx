// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketAppointments from './socketAppointments'; // Your WebSocket service
import { Appointment } from '../types/appointmentEvent';

interface WebSocketContextProps {
  setCurrentWeek: (week: Date[]) => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]); // Keep track of current week

  useEffect(() => {
    // Set up WebSocket connection at the application level
    const handleAppointment = (tinyAppointment: Appointment) => {
      setAppointments((prevAppointments) => [...prevAppointments, tinyAppointment]);
    };

    SocketAppointments.addListener(handleAppointment);

    return () => {
      SocketAppointments.removeListener(handleAppointment);
      SocketAppointments.closeConnection(); // Keep connection open until app closes
    };
  }, []);

  useEffect(() => {
    // Only request appointments if `currentWeek` is available
    if (currentWeek.length > 0) {
      SocketAppointments.requestAppointments(
        currentWeek[0]?.toISOString().split('T')[0],
        currentWeek[6]?.toISOString().split('T')[0],
        'demo_db' // Update as necessary
      );
    }
  }, [currentWeek]);

  return (
    <WebSocketContext.Provider value={{ setCurrentWeek, appointments, setAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
