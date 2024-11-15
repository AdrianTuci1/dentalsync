// Message sent from the main thread to the worker
export interface WorkerRequest {
    action: string; // e.g., "connect", "send", "disconnect"
    payload?: any;  // Optional payload, can be a WebSocket URL, message, etc.
}

// Message sent from the worker to the main thread
export interface WorkerResponse {
    type: string;   // e.g., "open", "message", "error", "close"
    data?: any;     // Data associated with the event
    error?: string; // Error message if something goes wrong
}
