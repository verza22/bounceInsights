import { Router, Request, Response } from 'express';
import { fetchWithFallback, groupByRegion } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { NASA_API_TOKEN } from '../config';

const router = Router();

router.get("/cme", async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;
  
    const { valid, errors } = validateFields(req.query, [
      { field: 'dateFrom', type: 'string', required: true },
      { field: 'dateTo', type: 'string', required: true },
    ]);
  
    if (!valid) {
      res.status(400).json({ errors });
    }
  
    const url = `https://api.nasa.gov/DONKI/CME?startDate=${dateFrom}&endDate=${dateTo}&api_key=${NASA_API_TOKEN}`;
    const fallback = "./responses/cme.json";
  
    try {
      const rawData = await fetchWithFallback(url, fallback);
      const groupedData = groupByRegion(rawData);
      res.json(groupedData);
    } catch (err) {
      res.status(500).json({ error: "Error al procesar los datos de CME" });
    }
});

export default router;