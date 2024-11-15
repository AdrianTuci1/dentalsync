import { Appointment } from "../../clinic/types/appointmentEvent";

// Define the type for appointment listeners
type AppointmentListener = (appointment: Appointment) => void;

class SocketAppointments {
  private static instances: Map<string, SocketAppointments> = new Map();
  private socket: WebSocket;
  private isConnected: boolean;
  private listeners: AppointmentListener[] = [];
  private messageQueue: string[] = [];
  private throttledMessages: string[] = [];
  private throttleTimeout: NodeJS.Timeout | null = null;

  private constructor(private socketUrl: string) {
    this.socket = new WebSocket(socketUrl);
    this.isConnected = false;

    this.initWebSocket();
  }

  public static getInstance(socketUrl: string): SocketAppointments {
    if (!this.instances.has(socketUrl)) {
      this.instances.set(socketUrl, new SocketAppointments(socketUrl));
    }
    return this.instances.get(socketUrl)!;
  }

  private initWebSocket() {
    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
      this.flushMessageQueue();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const appointment: Appointment = JSON.parse(event.data);
      console.log('Appointment received:', appointment);
      this.listeners.forEach((listener) => listener(appointment));
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.attemptReconnection();
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnection() {
    let retryDelay = 1000;
    const maxDelay = 60000;

    const tryReconnect = () => {
      if (!this.isConnected) {
        console.log(`Reconnecting in ${retryDelay / 1000} seconds...`);
        setTimeout(() => {
          this.socket = new WebSocket(this.socketUrl);
          this.initWebSocket();

          if (!this.isConnected) {
            retryDelay = Math.min(retryDelay * 2, maxDelay);
            tryReconnect();
          }
        }, retryDelay);
      }
    };

    tryReconnect();
  }

  public requestAppointments(subdomain: string, medicUser: string | null = null) {
    const message = JSON.stringify({ subdomain, medicUser });

    if (this.isConnected) {
      if (this.throttleTimeout) {
        this.throttledMessages.push(message);
      } else {
        this.socket.send(message);
        this.throttleTimeout = setTimeout(() => {
          while (this.throttledMessages.length > 0) {
            const pendingMessage = this.throttledMessages.shift();
            if (pendingMessage) this.socket.send(pendingMessage);
          }
          this.clearThrottleTimeout();
        }, 5000);
      }
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue() {
    while (this.isConnected && this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) this.socket.send(message);
    }
  }

  private clearThrottleTimeout() {
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
      this.throttleTimeout = null;
    }
  }

  public addListener(callback: AppointmentListener) {
    this.listeners.push(callback);
  }

  public removeListener(callback: AppointmentListener) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  public closeConnection() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public getConnectionStatus(): { isConnected: boolean; readyState: number } {
    return {
      isConnected: this.isConnected,
      readyState: this.socket.readyState,
    };
  }
}

export default SocketAppointments;
