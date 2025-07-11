import { WEBSOCKET_URL } from "../config/config";

let webSocket: WebSocket | null = null;

type MessageHandler = (data: string) => void;

const listeners: Partial<Record<wsType, MessageHandler[]>> = {};

export const connectWebSocket = () => {
  if (!webSocket || webSocket.readyState === WebSocket.CLOSED) {
    webSocket = new WebSocket(WEBSOCKET_URL);

    webSocket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as { type: wsType; payload: string };
        const { type, payload } = parsed;

        if (listeners[type]) {
          listeners[type]?.forEach((cb) => cb(payload));
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };
  }

  return webSocket;
};

export const addWebSocketListener = (type: wsType, callback: MessageHandler) => {
  if (!listeners[type]) listeners[type] = [];
  listeners[type]!.push(callback);
};

export const removeWebSocketListener = (type: wsType, callback: MessageHandler) => {
  listeners[type] = (listeners[type] || []).filter((cb) => cb !== callback);
};