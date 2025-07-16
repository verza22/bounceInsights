import React, { useEffect } from 'react';
import { connectWebSocket, addOpenListener, closeWebSocket } from '../utils/websocket';
import { useAppStore } from '../store/useAppStore';

const WebSocket: React.FC = () => {
  const { clientId } = useAppStore();

  useEffect(() => {
    connectWebSocket();

    const handleOpen = () => {
      const ws = connectWebSocket();
      ws.send(clientId);
      console.log("Sent clientId on open:", clientId);
    };

    addOpenListener(handleOpen);
  }, []);

  return null;
};

export default WebSocket;