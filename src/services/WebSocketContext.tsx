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
  const [throttleTimeout, setThrottleTimeout] = useState<NodeJS.Timeout | null>(null);

  // Add appointment only if it's unique
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

  const throttledRequestAppointments = (isAllAppointments: boolean, medicUser?: string) => {
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }
    setThrottleTimeout(setTimeout(() => {
      requestAppointments(isAllAppointments, medicUser);
      setThrottleTimeout(null);
    }, 5000)); // Adjust delay as necessary
  };

  const requestAppointments = (isAllAppointments: boolean, medicUser?: string) => {
    if (currentWeek.length === 7) {
      const startDate = currentWeek[0].toISOString().split('T')[0];
      const endDate = currentWeek[6].toISOString().split('T')[0];
      SocketAppointments.requestAppointments(
        startDate,
        endDate,
        'demo_db',
        isAllAppointments ? null : medicUser || null
      );
    }
  };

  useEffect(() => {
    if (currentWeek.length === 7) {
      throttledRequestAppointments(true); // Fetch all appointments by default
    }
  }, [currentWeek]);

  return (
    <WebSocketContext.Provider value={{ setCurrentWeek, currentWeek, appointments, setAppointments, requestAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
