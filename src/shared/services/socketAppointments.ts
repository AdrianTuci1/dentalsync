type MessageListener = (message: any) => void;

class SocketAppointments {
  private static instances: Map<string, SocketAppointments> = new Map();
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private listeners: MessageListener[] = [];
  private messageQueue: string[] = [];
  private throttledMessages: string[] = [];
  private throttleTimeout: NodeJS.Timeout | null = null;
  private reconnectionAttempts: number = 0;
  private readonly maxReconnectionAttempts: number = 3;
  private readonly reconnectionDelay: number = 10000; // 10 seconds
  private connectionPromise: Promise<void> | null = null;

  private constructor(private socketUrl: string) {
    this.initWebSocket();
  }

  /**
   * Singleton instance for the WebSocket
   */
  public static getInstance(socketUrl: string): SocketAppointments {
    if (!this.instances.has(socketUrl)) {
      this.instances.set(socketUrl, new SocketAppointments(socketUrl));
    }
    return this.instances.get(socketUrl)!;
  }

  /**
   * Initialize the WebSocket connection and set up event handlers
   */
  private initWebSocket(): Promise<void> {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket is already connecting or connected.");
      return Promise.resolve();
    }

    this.socket = new WebSocket(this.socketUrl);

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket!.onopen = () => {
        this.isConnected = true;
        console.log("WebSocket connected:", this.socketUrl);
        this.reconnectionAttempts = 0;
        this.flushMessageQueue();
        resolve();
      };

      this.socket!.onmessage = this.handleMessage.bind(this);
      this.socket!.onclose = this.handleClose.bind(this);
      this.socket!.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
        reject(error);
      };
    });

    return this.connectionPromise;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message);
      this.listeners.forEach((listener) => listener(message));
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error, event.data);
    }
  }

  private handleClose() {
    this.isConnected = false;
    console.log("WebSocket disconnected. Attempting to reconnect...");
    this.attemptReconnection();
  }

  /**
   * Attempt to reconnect the WebSocket
   */
  private attemptReconnection() {
    if (this.socket?.readyState === WebSocket.CONNECTING || this.socket?.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connecting or connected. Skipping reconnection.");
      return;
    }

    if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
      console.warn("Max reconnection attempts reached. Stopping reconnection.");
      return;
    }

    this.reconnectionAttempts++;
    setTimeout(() => {
      console.log(`Reconnecting to WebSocket (#${this.reconnectionAttempts})...`);
      this.initWebSocket();
    }, this.reconnectionDelay);
  }

  /**
   * Request appointments from the server
   */
  public async requestAppointments(params?: { medicId?: string; startDate?: string; endDate?: string }) {
    const message = JSON.stringify(params || {}); // Convert params to JSON or send an empty object if undefined

    try {
      await this.initWebSocket(); // Ensure the WebSocket connection is established
      console.log("Requesting appointments with params:", params);

      if (this.isConnected) {
        if (this.throttleTimeout) {
          this.throttledMessages.push(message);
        } else {
          this.socket!.send(message);
          this.setupThrottling();
        }
      } else {
        console.warn("WebSocket not connected. Queuing message.");
        this.messageQueue.push(message);
      }
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  }

  /**
   * Process queued messages
   */
  private flushMessageQueue() {
    while (this.isConnected && this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) this.socket!.send(message);
    }
  }

  /**
   * Setup throttling for message sending
   */
  private setupThrottling() {
    this.throttleTimeout = setTimeout(() => {
      while (this.throttledMessages.length > 0) {
        const message = this.throttledMessages.shift();
        if (message) this.socket!.send(message);
      }
      this.clearThrottleTimeout();
    }, 5000);
  }

  private clearThrottleTimeout() {
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
      this.throttleTimeout = null;
    }
  }

  /**
   * Add a listener for incoming WebSocket messages
   */
  public addListener(callback: MessageListener) {
    this.listeners.push(callback);
  }

  /**
   * Remove a listener for incoming WebSocket messages
   */
  public removeListener(callback: MessageListener) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  /**
   * Close the WebSocket connection
   */
  public closeConnection() {
    if (this.socket) {
      this.socket.close();
    }
  }

  /**
   * Get the current WebSocket connection status
   */
  public getConnectionStatus(): { isConnected: boolean; readyState: number } {
    return {
      isConnected: this.isConnected,
      readyState: this.socket?.readyState || WebSocket.CLOSED,
    };
  }
}

export default SocketAppointments;
