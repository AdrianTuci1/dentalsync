import { Appointment } from '../types/appointmentEvent';

interface AppointmentRequest {
  startDate: string | null;
  endDate: string | null;
  medicUserId?: number | null;
  clinicDatabase: string;
}

type AppointmentListener = (appointment: Appointment) => void;

class SocketAppointments {
  private static instance: SocketAppointments;
  private socket: WebSocket;
  private isConnected: boolean;
  private listeners: AppointmentListener[];
  private messageQueue: string[] = [];
  private reconnectInterval: number | undefined;

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
    // Handle WebSocket connection open
    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('Connected to WebSocket server');
      this.flushMessageQueue();

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = undefined;
      }
    };

    // Handle incoming messages (tiny appointments)
    this.socket.onmessage = (event: MessageEvent) => {
      const tinyAppointment: Appointment = JSON.parse(event.data);
      console.log('Tiny Appointment received:', tinyAppointment);
      this.listeners.forEach((listener) => listener(tinyAppointment));
    };

    // Handle WebSocket close
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.attemptReconnection(socketUrl);
    };

    // Handle WebSocket error
    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnection(socketUrl: string) {
    if (!this.isConnected) {
      console.log('Attempting to reconnect to WebSocket...');
      this.reconnectInterval = setInterval(() => {
        if (!this.isConnected) {
          this.socket = new WebSocket(socketUrl);
          this.initWebSocket(socketUrl);
        } else {
          clearInterval(this.reconnectInterval);
        }
      }, 5000); // Retry every 5 seconds
    }
  }

  requestAppointments(startDate: string | null, endDate: string | null, clinicDatabase: string, medicUserId: number | null = null) {
    const requestPayload: AppointmentRequest = {
      startDate,
      endDate,
      clinicDatabase,
      medicUserId,
    };
    const message = JSON.stringify(requestPayload);

    if (this.isConnected) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not connected. Queuing message.');
      this.messageQueue.push(message);
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
