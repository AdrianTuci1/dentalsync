import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketAppointments from './socketAppointments';
import { Appointment } from '../../clinic/types/appointmentEvent';
import { getSubdomain } from '../utils/getSubdomains'; // Utility to get subdomain

interface WebSocketContextProps {
  appointments: Appointment[];
  error: string | null;
  filterAppointmentsByMedic: (medicId: string) => Appointment[]; // Method to filter locally
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const subdomain = getSubdomain(); // Get subdomain once in the provider

  const initializeWebSocket = () => {
    const socketInstance = SocketAppointments.getInstance('ws://localhost:3000/api/appointment-socket');

    const handleAppointment = (appointment: Appointment) => {
      setAppointments((prevAppointments) => {
        const exists = prevAppointments.some((a) => a.appointmentId === appointment.appointmentId);
        return exists ? prevAppointments : [...prevAppointments, appointment];
      });
    };

    socketInstance.addListener(handleAppointment);

    try {
      // Fetch initial appointments with the subdomain
      socketInstance.requestAppointments(subdomain);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while requesting appointments.');
    }

    return () => {
      socketInstance.removeListener(handleAppointment);
      socketInstance.closeConnection();
    };
  };

  useEffect(() => {
    initializeWebSocket();
  }, []);

  // Filter appointments by medicId locally
  const filterAppointmentsByMedic = (medicId: string) => {
    return appointments.filter((appointment) => appointment.medicUser === medicId);
  };

  return (
    <WebSocketContext.Provider value={{ appointments, error, filterAppointmentsByMedic }}>
      {children}
    </WebSocketContext.Provider>
  );
};
