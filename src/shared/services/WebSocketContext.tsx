import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { Appointment } from "../../clinic/types/appointmentEvent";
import { getSubdomain } from "../utils/getSubdomains";

interface WebSocketContextProps {
  appointments: Appointment[];
  fetchAppointments: (params?: { startDate?: string; endDate?: string; medicId?: string }) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const subdomain = getSubdomain();
  const workerRef = useRef<Worker | null>(null);

  // Merge or replace a single appointment in the current state
  const updateAppointment = useCallback((updatedAppointment: Appointment) => {
    setAppointments((prevAppointments) => {
      const existingIndex = prevAppointments.findIndex(
        (appt) => appt.appointmentId === updatedAppointment.appointmentId
      );

      if (existingIndex !== -1) {
        const updatedAppointments = [...prevAppointments];
        updatedAppointments[existingIndex] = updatedAppointment;
        return updatedAppointments;
      } else {
        return [...prevAppointments, updatedAppointment];
      }
    });
  }, []);

  const handleWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === "message" && payload.type === "appointments" && payload.action === "view") {
      if (Array.isArray(payload.data)) {
        setAppointments(payload.data);
      } else if (typeof payload.data === "object" && payload.data !== null) {
        updateAppointment(payload.data);
      } else {
        console.warn("Invalid data received for appointments:", payload.data);
      }
    } else {
      console.warn("Unhandled WebSocket message:", payload);
    }
  }, [updateAppointment]);

  useEffect(() => {
    const worker = new Worker(new URL("../../workers/webSocketWorker.ts", import.meta.url));
    workerRef.current = worker;

    worker.onmessage = handleWorkerMessage;

    // Connect to the WebSocket server
    worker.postMessage({
      action: "connect",
      payload: { url: `ws://localhost:3000/api/appointment-socket?subdomain=${subdomain}` },
    });

    // Send an empty message to retrieve initial appointments
    worker.postMessage({
      action: "send",
      payload: { message: {} },
    });

    return () => {
      worker.postMessage({ action: "disconnect" });
      worker.terminate();
    };
  }, [handleWorkerMessage, subdomain]);

  const fetchAppointments = useCallback((params?: { startDate?: string; endDate?: string; medicId?: string }) => {
    workerRef.current?.postMessage({
      action: "send",
      payload: { message: params || {} },
    });
  }, []);

  return (
    <WebSocketContext.Provider value={{ appointments, fetchAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};
