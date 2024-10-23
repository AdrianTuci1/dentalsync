import { Appointment } from '../types/appointmentEvent';

interface AppointmentRequest {
  subdomain: string;  // Send the subdomain to the server
  medicUser?: string | null;
}

type AppointmentListener = (appointment: Appointment) => void;

class SocketAppointments {
  private static instance: SocketAppointments;
  private socket: WebSocket;
  private isConnected: boolean;
  private listeners: AppointmentListener[];
  private messageQueue: string[] = [];
  private reconnectInterval: number | undefined;
  private throttleTimeout: NodeJS.Timeout | null = null; // Throttle timeout reference
  private pendingRequest: string | null = null; // To hold pending request if throttled

  private constructor(socketUrl: string) {
    this.socket = new WebSocket(socketUrl);
    this.isConnected = false;
    this.listeners = [];
    this.reconnectInterval = undefined;

    this.initWebSocket(socketUrl);
  }

  public static getInstance(socketUrl: string): SocketAppointments {
    if (!SocketAppointments.instance) {
      SocketAppointments.instance = new SocketAppointments(socketUrl);
    }
    return SocketAppointments.instance;
  }

  private initWebSocket(socketUrl: string) {
    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
      this.flushMessageQueue();

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = undefined;
      }
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const tinyAppointment: Appointment = JSON.parse(event.data);
      console.log('Tiny Appointment received:', tinyAppointment);
      this.listeners.forEach((listener) => listener(tinyAppointment));
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.attemptReconnection(socketUrl);
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnection(socketUrl: string) {
    if (!this.isConnected) {
      console.log('Attempting to reconnect to WebSocket...');
      this.reconnectInterval = window.setInterval(() => {
        if (!this.isConnected) {
          this.socket = new WebSocket(socketUrl);
          this.initWebSocket(socketUrl);
        } else {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = undefined;
        }
      }, 15000); // Retry every 15 seconds
    }
  }

  // Throttled requestAppointments method
  requestAppointments(subdomain: string, medicUser: string | null = null) {
    const requestPayload: AppointmentRequest = {
      subdomain,  // Send subdomain to the server
      medicUser,
    };
    const message = JSON.stringify(requestPayload);

    if (this.isConnected) {
      if (this.throttleTimeout) {
        // If we're within the throttle period, store the latest request
        this.pendingRequest = message;
      } else {
        // Send immediately and start throttling
        this.socket.send(message);
        this.throttleTimeout = setTimeout(() => {
          // When throttle period ends, send pending request if available
          if (this.pendingRequest) {
            this.socket.send(this.pendingRequest);
            this.pendingRequest = null;
          }
          this.clearThrottleTimeout();
        }, 5000); // Throttle period of 5 seconds
      }
    } else {
      console.error('WebSocket is not connected. Queuing message.');
      this.messageQueue.push(message);
    }
  }

  private clearThrottleTimeout() {
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
      this.throttleTimeout = null;
    }
  }

  private flushMessageQueue() {
    while (this.isConnected && this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.socket.send(message);
      }
    }
  }

  addListener(callback: AppointmentListener) {
    this.listeners.push(callback);
  }

  removeListener(callback: AppointmentListener) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default SocketAppointments.getInstance('ws://localhost:3000/api/appointment-socket');
