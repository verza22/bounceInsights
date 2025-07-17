import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';

const router = Router();

router.get("/curiosity", async (req: Request, res: Response) => {
    const { dateFrom } = req.query;
  
    const { valid } = validateFields(req.query, [
      { field: 'dateFrom', type: 'string', required: true }
    ]);
  
    if (!valid) {
      res.status(400).json({ error: 'error.400' });
    }
  
    const url = `mars-photos/api/v1/rovers/curiosity/photos?earth_date=${dateFrom}&api_key=${process.env.NASA_API_TOKEN}`;
    const fallback = "./responses/curiosity.json";
  
    try {
      const data = await fetchWithFallback(url, fallback);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'error.500-002' });
    }
});

export default router;