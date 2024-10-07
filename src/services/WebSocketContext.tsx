import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketAppointments from './socketAppointments';
import { Appointment } from '../types/appointmentEvent';

interface WebSocketContextProps {
  setCurrentWeek: (week: Date[]) => void;
  currentWeek: Date[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  requestAppointments: (isAllAppointments: boolean, medicUser?: string) => void;
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
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // Helper function to check for duplicate appointments
  const addUniqueAppointment = (newAppointment: Appointment) => {
    setAppointments((prevAppointments) => {
      // Check if the appointment already exists in the state
      const appointmentExists = prevAppointments.some(
        (appointment) => appointment.appointmentId === newAppointment.appointmentId
      );

      // If not, append the new appointment
      if (!appointmentExists) {
        return [...prevAppointments, newAppointment];
      }
      return prevAppointments; // Otherwise, return the previous state as is
    });
  };

  useEffect(() => {
    const handleAppointment = (tinyAppointment: Appointment) => {
      addUniqueAppointment(tinyAppointment);
    };

    SocketAppointments.addListener(handleAppointment);

    return () => {
      SocketAppointments.removeListener(handleAppointment);
      SocketAppointments.closeConnection();
    };
  }, []);

  const requestAppointments = (isAllAppointments: boolean, medicUser?: string) => {
    if (currentWeek.length > 0) {
      SocketAppointments.requestAppointments(
        currentWeek[0]?.toISOString().split('T')[0],
        currentWeek[6]?.toISOString().split('T')[0],
        'demo_db', // Update as necessary
        isAllAppointments ? null : medicUser || null
      );
    }
  };

  useEffect(() => {
    if (currentWeek.length > 0) {
      requestAppointments(true); // Default to fetching all appointments
    }
  }, [currentWeek]);

  return (
    <WebSocketContext.Provider value={{ setCurrentWeek, currentWeek, appointments, setAppointments, requestAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
