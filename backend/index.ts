import express, { Request, Response } from 'express';
import cors from "cors";
import { groupByRegion } from "./utils/groupByRegion";
import { readJSONFile } from "./utils/readJSONFile";
import { fetchWithFallback } from "./utils/fetchWithFallback";

import { NASA_API_TOKEN } from './config';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('Backend funcionando con TypeScript');
});

// APOD
app.get("/nasa/apod", async (req: Request, res: Response) => {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/apod.json";

  try {
    const data = await fetchWithFallback(url, fallback);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de APOD" });
  }
});

// NEO
app.get("/nasa/neo", async (req: Request, res: Response) => {
  const start_date = "2025-07-01";
  const end_date = "2025-07-07";
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/neo.json";

  try {
    const data = await fetchWithFallback(url, fallback);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de NEO" });
  }
});

// CME
app.get("/nasa/cme", async (req: Request, res: Response) => {
  const startDate = "2025-06-01";
  const endDate = "2025-07-01";
  const url = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/cme.json";

  try {
    const rawData = await fetchWithFallback(url, fallback);
    const groupedData = groupByRegion(rawData);
    res.json(groupedData);
  } catch (err) {
    res.status(500).json({ error: "Error al procesar los datos de CME" });
  }
});

// GST
app.get("/nasa/gst", async (req: Request, res: Response) => {
  const startDate = "2025-06-01";
  const endDate = "2025-07-01";
  const url = `https://api.nasa.gov/DONKI/GST?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/gst.json";

  try {
    const rawData = await fetchWithFallback(url, fallback);

    const kpEntries: { date: string; kp: number }[] = rawData.flatMap((gst: any) => {
      const kpArray = gst.allKpIndex || [];
      return kpArray.map((kp: any) => ({
        date: kp.observedTime?.split("T")[0] || "unknown",
        kp: kp.kpIndex
      }));
    });

    res.json(kpEntries);
  } catch (err) {
    console.error("Error al procesar datos de GST:", err);
    res.status(500).json({ error: "Error al procesar datos de GST" });
  }
});

// Insight Weather
app.get("/nasa/insight", async (req: Request, res: Response) => {
  const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_TOKEN}&feedtype=json&ver=1.0`;
  const fallback = "./responses/inSight.json";

  try {
    const rawData = await fetchWithFallback(url, fallback);

    const sols = rawData?.sol_keys || [];
    const result = sols.map((sol: string) => {
      const solData = rawData[sol];
      return {
        sol,
        minTemp: solData?.AT?.mn ?? null,
        maxTemp: solData?.AT?.mx ?? null
      };
    }).filter((entry:any) => entry.minTemp !== null && entry.maxTemp !== null);

    res.json(result);
  } catch (err) {
    console.error("Error al procesar datos de InSight:", err);
    res.status(500).json({ error: "Error al procesar datos de InSight" });
  }
});

// Curiosity
app.get("/nasa/curiosity", async (req: Request, res: Response) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1&api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/curiosity.json";

  try {
    const data = await fetchWithFallback(url, fallback);
    res.json(data); // Devuelve todas las fotos del sol 1
  } catch (err) {
    console.error("Error al obtener datos del rover Curiosity:", err);
    res.status(500).json({ error: "Error al obtener datos del rover Curiosity" });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
