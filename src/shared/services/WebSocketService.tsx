import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";
import { getSubdomain } from "../utils/getSubdomains";
import { cache } from "@/api/cacheService";
import store from "@/shared/services/store";
import { webSocketUpdateThunk } from "@/api/slices/appointmentsSlice";
import { useSelector } from "react-redux";

interface WebSocketContextProps {
  appointments: any[]; // ✅ Include appointments in context
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
  const subdomain = getSubdomain();
  const workerRef = useRef<Worker | null>(null);
  const [webSocketConnected, setWebSocketConnected] = useState(false);

  // ✅ Retrieve `appointments` from Redux
  const appointments = useSelector((state: any) => state.appointments.weeklyAppointments);

  const loadCachedAppointments = useCallback(async () => {
    const cachedAppointments = await cache.get("weeklyAppointments");
    if (cachedAppointments) {
      console.log("✅ Using cached appointments:", cachedAppointments);
      store.dispatch(webSocketUpdateThunk({ action: "view", data: cachedAppointments }));
    } else {
      console.warn("⚠️ No cached appointments available.");
    }
  }, []);

  const handleWorkerMessage = useCallback(async (event: MessageEvent) => {
    const { type, payload } = event.data;

    if (type === "open") {
      console.log("✅ WebSocket Connected");
      setWebSocketConnected(true);
    }

    if (type === "close" || type === "error") {
      console.warn(`⚠️ WebSocket ${type === "close" ? "closed" : "error occurred"}. Using cached data.`);
      setWebSocketConnected(false);
      loadCachedAppointments();
    }

    if (type === "message" && payload.type === "appointments") {
      store.dispatch(webSocketUpdateThunk(payload)); // ✅ Dispatch correct WebSocket action
      await cache.set("weeklyAppointments", payload.data); // ✅ Always update cache
    }
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("@/workers/webSocketWorker.ts", import.meta.url));
    workerRef.current = worker;
    worker.onmessage = handleWorkerMessage;

    worker.postMessage({
      action: "connect",
      payload: { url: `ws://localhost:3000/api/appointment-socket?subdomain=${subdomain}` },
    });

    return () => {
      worker.postMessage({ action: "disconnect" });
      worker.terminate();
    };
  }, [handleWorkerMessage, subdomain]);

  const fetchAppointments = useCallback(
    async (params?: { startDate?: string; endDate?: string; medicId?: string }) => {
      const message = {
        type: "appointments",
        action: "view",
        data: params || {},
      };

      workerRef.current?.postMessage({
        action: "send",
        payload: { message },
      });

      if (!webSocketConnected) {
        console.warn("⚠️ WebSocket not connected. Using cached data.");
        loadCachedAppointments();
      }
    },
    [loadCachedAppointments, webSocketConnected]
  );

  return (
    <WebSocketContext.Provider value={{ appointments, fetchAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};