/// <reference lib="webworker" />

import { WorkerResponse } from "@/features/clinic/types/worker";

let websocket: WebSocket | null = null;
let messageQueue: string[] = []; // ✅ Message queue if WebSocket is not open
let reconnectAttempts = 0; // ✅ Keep track of reconnect attempts

const MAX_RECONNECT_ATTEMPTS = 5; // ✅ Avoid infinite reconnecting
const RECONNECT_INTERVAL = 5000; // ✅ Wait 5 seconds before reconnecting

self.onmessage = (event: MessageEvent) => {
  const { action, payload } = event.data;

  switch (action) {
    case "connect":
      if (websocket) {
        console.warn("⚠️ WebSocket is already connected.");
        return;
      }
      connectWebSocket(payload.url);
      break;

    case "send":
      if (!payload?.message || !payload.message.type || !payload.message.action) {
        console.error("❌ WebSocket: Invalid message format", payload.message);
        return;
      }
      sendMessage(payload.message);
      break;

    case "disconnect":
      disconnectWebSocket();
      break;

    default:
      console.error("❌ Unknown WebSocket action:", action);
  }
};

/** ✅ Connects WebSocket with automatic reconnecting */
function connectWebSocket(url: string) {
  websocket = new WebSocket(url);

  websocket.onopen = () => {
    console.log("✅ WebSocket connected:", url);
    postMessage({ type: "open" } as WorkerResponse);

    // ✅ Send queued messages
    messageQueue.forEach((msg) => websocket?.send(msg));
    messageQueue = [];
    reconnectAttempts = 0; // ✅ Reset reconnection attempts
  };

  websocket.onmessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      handleIncomingMessage(message);
    } catch (error) {
      console.error("❌ Invalid WebSocket message received:", event.data, error);
    }
  };

  websocket.onclose = () => {
    console.warn("⚠️ WebSocket closed.");
    postMessage({ type: "close" } as WorkerResponse);
    websocket = null;
    attemptReconnect(url);
  };

  websocket.onerror = () => {
    console.error("❌ WebSocket error.");
    postMessage({ type: "error", payload: "WebSocket encountered an error." } as WorkerResponse);
  };
}

/** ✅ Attempts to reconnect WebSocket if it closes */
function attemptReconnect(url: string) {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`🔄 Reconnecting WebSocket... Attempt ${reconnectAttempts}`);
    setTimeout(() => connectWebSocket(url), RECONNECT_INTERVAL);
  } else {
    console.error("❌ Maximum WebSocket reconnect attempts reached.");
  }
}

/** ✅ Trimite un mesaj prin WebSocket și loghează-l */
function sendMessage(message: any) {
  const messageString = JSON.stringify(message);
  console.log("📤 Sending WebSocket message:", message); // ✅ Log mesaj trimis
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(messageString);
  } else {
    console.warn("⚠️ WebSocket is not connected. Queuing message:", message);
    messageQueue.push(messageString);
  }
}

/** ✅ Loghează fiecare mesaj primit */
function handleIncomingMessage(message: any) {
  console.log("📩 WebSocket Message Received:", message);

  if (!message?.type) {
    console.warn("⚠️ Received message without type:", message);
    return;
  }

  if (message.type === "appointments") {
    postMessage({ type: "message", payload: message });
  } else {
    console.warn("⚠️ Unhandled WebSocket message type:", message.type);
  }
}

/** ✅ Disconnects WebSocket */
function disconnectWebSocket() {
  if (websocket) {
    websocket.close();
    websocket = null;
    console.log("✅ WebSocket disconnected.");
  }
}