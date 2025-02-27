import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";
import { getSubdomain } from "../utils/getSubdomains";
import { useDispatch, useSelector } from "react-redux";
import {
  setWeeklyAppointments,
  updateAppointmentState,
  removeAppointmentState,
} from "@/api/slices/appointmentsSlice";
import { RootState } from "@/shared/services/store"; // Import RootState
import { cache } from "@/api/cacheService";

interface WebSocketContextProps {
  appointments: any[];
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
  const dispatch = useDispatch();
  const appointments = useSelector((state: RootState) => state.appointments.appointments); // ✅ Get Redux state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [receivedResponse, setReceivedResponse] = useState(false); // Track if WebSocket responds

  // ✅ Handle online/offline status change
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // ✅ 1. Load cached weekly appointments if WebSocket fails
  const loadCachedAppointments = useCallback(async () => {
    console.log("📌 Loading cached weekly appointments...");
    const cachedAppointments = await cache.get("weeklyAppointments");
    if (cachedAppointments) {
      console.log("✅ Using cached appointments:", cachedAppointments);
      dispatch(setWeeklyAppointments(cachedAppointments));
    } else {
      console.warn("⚠️ No cached appointments available.");
    }
  }, [dispatch]);

  // ✅ 2. Handle incoming WebSocket messages
  const handleWorkerMessage = useCallback(async (event: MessageEvent) => {
    const { type, payload } = event.data;
  
    console.log("📩 WebSocket message received:", payload);
    setReceivedResponse(true); // ✅ Mark WebSocket as responding
  
    if (type === "message" && payload.type === "appointments") {
      let cachedAppointments = (await cache.get("weeklyAppointments")) || [];
  
      switch (payload.action) {
        case "view":
          if (Array.isArray(payload.data)) {
            console.log("✅ Updating weekly appointment list from WebSocket");
            dispatch(setWeeklyAppointments(payload.data));
            await cache.set("weeklyAppointments", payload.data); // ✅ Save in cache
          } else {
            console.warn("⚠️ Invalid 'view' response:", payload.data);
          }
          break;
  
        case "create":
          if (payload.data) {
            console.log(`➕ Adding new appointment: ${payload.data.appointmentId}`);
            dispatch(updateAppointmentState(payload.data));
  
            // Add to cache if not already present
            if (!cachedAppointments.some((appt) => appt.appointmentId === payload.data.appointmentId)) {
              cachedAppointments = [...cachedAppointments, payload.data];
              await cache.set("weeklyAppointments", cachedAppointments);
            }
          } else {
            console.warn(`⚠️ No data received for 'create' action.`);
          }
          break;
  
        case "update":
          if (payload.data) {
            console.log(`🔄 Updating appointment: ${payload.data.appointmentId}`);
            dispatch(updateAppointmentState(payload.data));
  
            // Update cache
            cachedAppointments = cachedAppointments.map((appt) =>
              appt.appointmentId === payload.data.appointmentId ? payload.data : appt
            );
            await cache.set("weeklyAppointments", cachedAppointments);
          } else {
            console.warn(`⚠️ No data received for 'update' action.`);
          }
          break;
  
        case "delete":
          if (payload.data?.appointmentId) {
            console.log(`🗑️ Removing appointment: ${payload.data.appointmentId}`);
            dispatch(removeAppointmentState(payload.data.appointmentId));
  
            // Remove from cache
            cachedAppointments = cachedAppointments.filter(
              (appt) => appt.appointmentId !== payload.data.appointmentId
            );
            await cache.set("weeklyAppointments", cachedAppointments);
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
  }, [dispatch]);

  // ✅ 3. Initialize WebSocketWorker
  useEffect(() => {
    const worker = new Worker(new URL("@/workers/webSocketWorker.ts", import.meta.url));
    workerRef.current = worker;
    worker.onmessage = handleWorkerMessage;
    setReceivedResponse(false); // Reset WebSocket response tracker

    worker.postMessage({
      action: "connect",
      payload: { url: `ws://localhost:3000/api/appointment-socket?subdomain=${subdomain}` },
    });

    // **✅ If no WebSocket response after 5 seconds, load cache**
    setTimeout(() => {
      if (!receivedResponse) {
        console.warn("⏳ WebSocket did not respond, using cached data...");
        loadCachedAppointments();
      }
    }, 7000); // 5 seconds delay

    return () => {
      worker.postMessage({ action: "disconnect" });
      worker.terminate();
    };
  }, [handleWorkerMessage, subdomain, loadCachedAppointments]);

  // ✅ 4. Fetch weekly appointments (Use cache if WebSocket fails)
  const fetchAppointments = useCallback(
    async (params?: { startDate?: string; endDate?: string; medicId?: string }) => {
      setReceivedResponse(false); // Reset before sending request

      const message = {
        type: "appointments",
        action: "view",
        data: params || {},
      };

      console.log("📤 Sending WebSocket request:", message);
      workerRef.current?.postMessage({
        action: "send",
        payload: { message },
      });

      // **✅ If no WebSocket response after 5 seconds, use cache**
      setTimeout(() => {
        if (!receivedResponse) {
          console.warn("⏳ WebSocket did not respond, using cached data...");
          loadCachedAppointments();
        }
      }, 5000);
    },
    [loadCachedAppointments]
  );

  return (
    <WebSocketContext.Provider value={{ appointments, fetchAppointments }}>
      {children}
    </WebSocketContext.Provider>
  );
};