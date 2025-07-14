import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';

const router = Router();

router.get("/insight", async (req: Request, res: Response) => {
    const url = `https://api.nasa.gov/insight_weather/?api_key=${process.env.NASA_API_TOKEN}&feedtype=json&ver=1.0`;
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
      res.status(500).json({ error: 'error.500-002' });
    }
});

export default router;