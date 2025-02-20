import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { Appointment } from "@/features/clinic/types/appointmentEvent";
import { getSubdomain } from "../utils/getSubdomains";
import { cache } from "@/api/cacheService"; // ✅ Importăm cache-ul pentru stocarea offline

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

  // ✅ 1. Funcție pentru a salva datele în cache
  const saveToCache = async (data: Appointment[]) => {
    await cache.set("appointments", data);
  };

  // ✅ 2. Funcție pentru a încărca datele din cache dacă suntem offline
  const loadCachedAppointments = async () => {
    const cachedAppointments = await cache.get("appointments");
    if (cachedAppointments) {
      console.log("📌 Using cached appointments:", cachedAppointments);
      setAppointments(cachedAppointments);
    }
  };

  // ✅ 3. Adăugăm/modificăm o singură programare în state și cache
  const updateAppointment = useCallback(async (updatedAppointment: Appointment) => {
    setAppointments((prevAppointments) => {
      const existingIndex = prevAppointments.findIndex(
        (appt) => appt.appointmentId === updatedAppointment.appointmentId
      );

      const updatedAppointments = existingIndex !== -1
        ? [...prevAppointments.slice(0, existingIndex), updatedAppointment, ...prevAppointments.slice(existingIndex + 1)]
        : [...prevAppointments, updatedAppointment];

      saveToCache(updatedAppointments); // ✅ Salvăm modificările în cache
      return updatedAppointments;
    });
  }, []);

  // ✅ 4. Gestionăm mesajele primite din WebSocketWorker
  const handleWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, payload } = event.data;
  
    console.log("📩 Received WebSocket message:", payload);
  
    if (type === "message" && payload.type === "appointments") {
      switch (payload.action) {
        case "view":
          if (Array.isArray(payload.data)) {
            console.log("✅ Setting full appointment list");
            setAppointments(payload.data);
            saveToCache(payload.data);
          } else {
            console.warn("⚠️ Invalid 'view' response, expected an array:", payload.data);
          }
          break;
  
        case "create":
        case "update":
          if (payload.data) {
            console.log(`🔄 Updating appointment: ${payload.data.appointmentId}`);
            updateAppointment(payload.data);
          } else {
            console.warn(`⚠️ No data received for '${payload.action}' action.`);
          }
          break;
  
        case "delete":
          if (payload.data?.appointmentId) {
            console.log(`🗑️ Deleting appointment: ${payload.data.appointmentId}`);
            setAppointments((prev) => {
              const updated = prev.filter((appt) => appt.appointmentId !== payload.data.appointmentId);
              saveToCache(updated);
              return updated;
            });
          } else {
            console.warn("⚠️ Invalid delete message, missing appointmentId.");
          }
          break;
  
        default:
          console.warn("⚠️ Unhandled WebSocket action:", payload.action);
      }
    } else {
      console.warn("⚠️ Unrecognized WebSocket message:", payload);
    }
  }, [updateAppointment]);

  // ✅ 5. Inițializăm WebSocketWorker și încărcăm cache-ul dacă suntem offline
  useEffect(() => {
    const worker = new Worker(new URL("@/workers/webSocketWorker.ts", import.meta.url));
    workerRef.current = worker;

    worker.onmessage = handleWorkerMessage;

    // ✅ Dacă suntem offline, folosim datele din cache
    if (!navigator.onLine) {
      loadCachedAppointments();
    }

    // ✅ Conectăm WebSocket-ul
    worker.postMessage({
      action: "connect",
      payload: { url: `ws://localhost:3000/api/appointment-socket?subdomain=${subdomain}` },
    });

    return () => {
      worker.postMessage({ action: "disconnect" });
      worker.terminate();
    };
  }, [handleWorkerMessage, subdomain]);

  // ✅ 6. Funcție pentru a trimite cereri la WebSocketWorker
  // ✅ Corectăm fetchAppointments să trimită un mesaj valid
  const fetchAppointments = useCallback((params?: { startDate?: string; endDate?: string; medicId?: string }) => {
    const message = {
      type: "appointments",
      action: "view",
      data: params || {}, // ✅ Asigurăm că avem date valide
    };

    console.log("📤 Sending WebSocket request:", message);
    workerRef.current?.postMessage({
      action: "send",
      payload: { message },
    });
  }, []);

  return (
    <WebSocketContext.Provider value={{ appointments, fetchAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};