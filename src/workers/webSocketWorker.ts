/// <reference lib="webworker" />

import { WorkerResponse } from "../clinic/types/worker";

let websocket: WebSocket | null = null;
let messageQueue: string[] = []; // Queue messages until WebSocket is open

self.onmessage = (event: MessageEvent) => {
  const { action, payload } = event.data;

  switch (action) {
    case "connect":
      if (websocket) {
        console.warn("WebSocket is already connected.");
        return;
      }

      websocket = new WebSocket(payload.url);

      websocket.onopen = () => {
        console.log("WebSocket connected:", payload.url);
        postMessage({ type: "open" } as WorkerResponse);

        // Flush the message queue
        messageQueue.forEach((msg) => websocket?.send(msg));
        messageQueue = [];
      };

      websocket.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          postMessage({ type: "message", payload: message } as WorkerResponse);
        } catch (error) {
          console.error("Invalid WebSocket message received:", event.data, error);
        }
      };

      websocket.onclose = () => {
        console.warn("WebSocket closed.");
        postMessage({ type: "close" } as WorkerResponse);
        websocket = null;
      };

      websocket.onerror = () => {
        console.error("WebSocket error.");
        postMessage({ type: "error", payload: "WebSocket encountered an error." } as WorkerResponse);
      };
      break;

    case "send":
      const message = JSON.stringify(payload.message || {});
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(message);
      } else {
        console.warn("WebSocket is not connected. Queuing message.");
        messageQueue.push(message); // Queue the message until the connection is open
      }
      break;

    case "disconnect":
      if (websocket) {
        websocket.close();
        websocket = null;
      }
      break;

    default:
      console.error("Unknown action:", action);
  }
};
