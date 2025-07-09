import express, { Request, Response } from 'express';
import cors from "cors";
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use('/', routes); 

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend funcionando con TypeScript');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
