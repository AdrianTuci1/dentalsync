/// <reference lib="webworker" />

import { WorkerRequest, WorkerResponse } from "../clinic/types/worker";


let websocket: WebSocket | null = null;

// Correctly type the event as MessageEvent
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
    const { action, payload } = event.data;

    try {
        switch (action) {
            case 'connect':
                if (websocket) {
                    throw new Error('WebSocket is already connected.');
                }
                websocket = new WebSocket(payload.url);
                websocket.onopen = () => {
                    const response: WorkerResponse = { type: 'open' };
                    self.postMessage(response);
                };
                websocket.onmessage = (messageEvent) => {
                    const response: WorkerResponse = {
                        type: 'message',
                        data: messageEvent.data,
                    };
                    self.postMessage(response);
                };
                websocket.onerror = (_: Event) => {
                    const response: WorkerResponse = {
                        type: 'error',
                        error: 'WebSocket error occurred', // Generic error message
                    };
                    self.postMessage(response);
                };                
                websocket.onclose = () => {
                    const response: WorkerResponse = { type: 'close' };
                    self.postMessage(response);
                    websocket = null;
                };
                break;

            case 'send':
                if (!websocket || websocket.readyState !== WebSocket.OPEN) {
                    throw new Error('WebSocket is not connected.');
                }
                websocket.send(JSON.stringify(payload.message));
                break;

            case 'disconnect':
                if (websocket) {
                    websocket.close();
                    websocket = null;
                }
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (error) {
        const response: WorkerResponse = {
            type: 'error',
            error: (error as Error).message,
        };
        self.postMessage(response);
    }
};