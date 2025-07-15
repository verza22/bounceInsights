const isProd = process.env.NODE_ENV === 'production';

export const API_URL = isProd ? "https://nasa.luiszurita.es/api/" : "http://localhost:3001/api/";
export const WEBSOCKET_URL = isProd ? "wss://nasa.luiszurita.es/ws/" : "ws://localhost:3001/ws";
export const API_TIMEOUT = 10000;
export const ERROR_TIMEOUT = 7500;