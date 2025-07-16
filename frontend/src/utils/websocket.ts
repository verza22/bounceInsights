import { WEBSOCKET_URL, WS_RECONNECT_INTERVAL } from "../config/config";

let webSocket: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let manuallyClosed = false;

type MessageHandler = (data: string) => void;

let listeners: Partial<Record<wsType, MessageHandler[]>> = {};
const openListeners: (() => void)[] = [];
let reconnectListeners: (() => void)[] = [];

const cleanupWebSocket = () => {
  listeners = {};
  if (webSocket) {
    webSocket.onmessage = null;
    webSocket.onopen = null;
    webSocket.onclose = null;
    webSocket.onerror = null;
    webSocket.close();
  }
};

const notifyReconnect = () => {
  reconnectListeners.forEach((cb) => cb());
};

const setupWebSocketHandlers = () => {
  if (!webSocket) return;

  webSocket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data) as { type: wsType; payload: string };
      const { type, payload } = parsed;

      listeners[type]?.forEach((cb) => cb(payload));
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  };

  webSocket.onopen = () => {
    console.log("WebSocket connected");
    openListeners.forEach((cb) => cb());
    notifyReconnect();
  };

  webSocket.onclose = () => {
    console.warn("WebSocket closed. Attempting to reconnect...");
    if (!manuallyClosed) {
      scheduleReconnect();
    }
  };

  webSocket.onerror = (err) => {
    console.error("WebSocket error:", err);
    webSocket?.close();
  };
};

const scheduleReconnect = () => {
  if (reconnectTimeout || manuallyClosed) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectWebSocket();
  }, WS_RECONNECT_INTERVAL);
};

export const connectWebSocket = () => {
  if (!webSocket || webSocket.readyState === WebSocket.CLOSED || webSocket.readyState === WebSocket.CLOSING) {
    manuallyClosed = false;
    cleanupWebSocket();
    webSocket = new WebSocket(WEBSOCKET_URL);
    setupWebSocketHandlers();
  }

  return webSocket;
};

export const closeWebSocket = () => {
  manuallyClosed = true;
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  cleanupWebSocket();
};

export const addWebSocketListener = (type: wsType, callback: MessageHandler) => {
  if (!listeners[type]) listeners[type] = [];
  listeners[type]!.push(callback);
};

export const removeWebSocketListener = (type: wsType, callback: MessageHandler) => {
  listeners[type] = (listeners[type] || []).filter((cb) => cb !== callback);
};

export const addOpenListener = (callback: () => void) => {
  openListeners.push(callback);
};

export const addReconnectListener = (callback: () => void) => {
  reconnectListeners.push(callback);
};

export const removeReconnectListener = (callback: () => void) => {
  reconnectListeners = reconnectListeners.filter(cb => cb !== callback);
};