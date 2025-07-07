import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('Backend funcionando con TypeScript');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});