import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { wsMessage } from '../types/types';

const clients = new Map<string, WebSocket>();

export const setupWebSocket = (server: HttpServer) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Websocket new connection');

    ws.once('message', (msg) => {
      const clientId = msg.toString();
      clients.set(clientId, ws);

      ws.on('message', (message) => {
        console.log(`Message from ${clientId}:`, message.toString());
      });

      ws.on('close', () => {
        clients.delete(clientId);
      });
    });
  });
};

export const sendToClient = (clientId: string, obj: wsMessage) => {
  const ws = clients.get(clientId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({...obj}));
  }
};