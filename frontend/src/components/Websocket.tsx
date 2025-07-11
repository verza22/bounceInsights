import React, { useEffect } from 'react';
import { connectWebSocket } from '../utils/websocket';
import { useAppStore } from '../store/useAppStore';

const WebSocket: React.FC = () => {

    const { clientId } = useAppStore();

    useEffect(() => {
        const webSocket = connectWebSocket();

        webSocket.onopen = () => {
            webSocket.send(clientId);
            console.log('WebSocket connected');
        };

        // webSocket.onmessage = (event) => {
        //     console.log('Mensaje recibido del servidor:', event.data);
        // };

        webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        webSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
        webSocket.close();
        };
    }, []);

    return null;
};

export default WebSocket;