import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';

const router = Router();

router.get("/gst", async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;
  
    const { valid, errors } = validateFields(req.query, [
      { field: 'dateFrom', type: 'string', required: true },
      { field: 'dateTo', type: 'string', required: true },
    ]);
  
    if (!valid) {
      res.status(400).json({ errors });
    }
  
    const url = `https://api.nasa.gov/DONKI/GST?startDate=${dateFrom}&endDate=${dateTo}&api_key=${process.env.NASA_API_TOKEN}`;
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

export default router;