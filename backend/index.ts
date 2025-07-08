import express, { Request, Response } from 'express';
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('Backend funcionando con TypeScript');
});

app.get("/nasa/apod", async (req: Request, res: Response) => {
  const api_key = "DEMO_KEY";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching APOD from NASA API:", error);
    res.status(500).json({ error: "Error fetching APOD from NASA API" });
  }
});

app.get("/nasa/neo", async (req: Request, res: Response) => {
  const start_date = "2025-07-01";
  const end_date = "2025-07-07";
  const api_key = "DEMO_KEY";

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${api_key}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from NASA API:", error);
    res.status(500).json({ error: "Error fetching data from NASA API" });
  }
});

app.get("/nasa/cme", async (req: Request, res: Response) => {
  const startDate = "2025-06-01";
  const endDate = "2025-07-01";
  const api_key = "DEMO_KEY";

  const url = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Función para simplificar las regiones
    const getRegion = (location: string | null): string => {
      if (!location) return "Unknown";
      if (location.startsWith("N")) return "North";
      if (location.startsWith("S")) return "South";
      return "Unknown";
    };

    const grouped: Record<string, number> = {};

    data.forEach((item: any) => {
      const region = getRegion(item.sourceLocation || null);
      grouped[region] = (grouped[region] || 0) + 1;
    });

    const formattedData = Object.entries(grouped)
      .map(([name, y]) => ({ name, y }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching CME data from NASA API:", error);
    res.status(500).json({ error: "Error fetching CME data from NASA API" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});