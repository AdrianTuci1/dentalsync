import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketAppointments from './socketAppointments';
import { Appointment } from '../types/appointmentEvent';
import { getSubdomain } from '../utils/getSubdomains'; // Import getSubdomain utility

interface WebSocketContextProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  requestAppointments: (medicUser?: string) => void;
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
  const subdomain = getSubdomain(); // Get the clinic's subdomain to send in requests

  const addUniqueAppointment = (newAppointment: Appointment) => {
    setAppointments((prevAppointments) => {
      const appointmentExists = prevAppointments.some(
        (appointment) => appointment.appointmentId === newAppointment.appointmentId
      );
      if (!appointmentExists) {
        return [...prevAppointments, newAppointment];
      }
      return prevAppointments;
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

  const requestAppointments = (medicUser?: string) => {
    // Send the subdomain and medicUser (optional) to the WebSocket server
    SocketAppointments.requestAppointments(subdomain, medicUser || null);
  };

  // Trigger the WebSocket request for the current week's appointments when the context is mounted
  useEffect(() => {
    requestAppointments(); // Fetch appointments for the current week on component mount
  }, []);

  return (
    <WebSocketContext.Provider value={{ appointments, setAppointments, requestAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
