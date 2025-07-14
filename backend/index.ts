import express, { Request, Response } from 'express';
import cors from "cors";
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import routes from './routes';
import { setupWebSocket } from './sockets/websocket';


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/', routes); 

// WebSocket
setupWebSocket(server);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend online!');
});

server.listen(PORT, () => {
  console.log(`Server ON http://localhost:${PORT}`);
});
