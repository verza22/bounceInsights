import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { NASA_API_TOKEN } from '../config';

const router = Router();

router.get("/curiosity", async (req: Request, res: Response) => {
    const { dateFrom } = req.query;
  
    const { valid, errors } = validateFields(req.query, [
      { field: 'dateFrom', type: 'string', required: true }
    ]);
  
    if (!valid) {
      res.status(400).json({ errors });
    }
  
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${dateFrom}&api_key=${NASA_API_TOKEN}`;
    const fallback = "./responses/curiosity.json";
  
    try {
      const data = await fetchWithFallback(url, fallback);
      res.json(data); // Devuelve todas las fotos del sol 1
    } catch (err) {
      console.error("Error al obtener datos del rover Curiosity:", err);
      res.status(500).json({ error: "Error al obtener datos del rover Curiosity" });
    }
});

export default router;