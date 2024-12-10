import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import SocketAppointments from './socketAppointments';
import { Appointment } from '../../clinic/types/appointmentEvent';
import { getSubdomain } from '../utils/getSubdomains';

interface WebSocketContextProps {
  appointments: Appointment[];
  error: string | null;
  fetchAppointments: (params?: { medicId?: string; startDate?: string; endDate?: string }) => void;
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
  const subdomain = getSubdomain(); // Get the subdomain directly
  const socketInstance = useRef(
    SocketAppointments.getInstance(`ws://localhost:3000/api/appointment-socket?subdomain=${subdomain}`)
  );


  const updateAppointments = useCallback((message: any) => {
    switch (message.type) {
      case 'viewAppointments':
        setAppointments((prev) => {
          // Only update state if data has changed to prevent unnecessary renders
          const isDifferent = JSON.stringify(prev) !== JSON.stringify(message.data);
          return isDifferent ? message.data : prev;
        });
        break;

      case 'updateAppointment':
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.appointmentId === message.data.appointmentId ? message.data : appointment
          )
        );
        break;

      case 'deleteAppointment':
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.appointmentId !== message.data.appointmentId)
        );
        break;

      default:
        console.warn('Unhandled WebSocket message type:', message.type);
    }
  }, []);

  useEffect(() => {
    const socket = socketInstance.current;

    socket.addListener(updateAppointments);

    return () => {
      socket.removeListener(updateAppointments);
      socket.closeConnection();
    };
  }, [updateAppointments]);

  const fetchAppointments = useCallback(
    async (params?: { medicId?: string; startDate?: string; endDate?: string }) => {
      try {
        console.log("Fetching appointments with params:", params); // Debugging
        await socketInstance.current.requestAppointments(params);
      } catch (err) {
        console.error("Error requesting appointments:", err);
        setError((err as Error).message || "An error occurred while requesting appointments.");
      }
    },
    [] // Dependencies remain empty since `socketInstance` is a ref
  );
  

  return (
    <WebSocketContext.Provider value={{ appointments, error, fetchAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
