import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { NASA_API_TOKEN } from '../config';
import { sendToClient } from '../sockets/websocket';

const router = Router();

router.get("/apod", async (req: Request, res: Response) => {
  const { dateFrom, clientId } = req.query as { dateFrom: string, clientId: string };

  const { valid, errors } = validateFields(req.query, [
    { field: 'dateFrom', type: 'string', required: true },
    { field: 'clientId', type: 'string', required: true }
  ]);

  if (!valid) {
    res.status(400).json({ errors });
  }

  const url = `https://api.nasa.gov/planetary/apod?date=${dateFrom}&api_key=${NASA_API_TOKEN}`;
  const fallback = "./responses/apod.json";

  try {
    const data = await fetchWithFallback(url, fallback);

    const { hdurl, title, explanation } = data;

    sendToClient(clientId, { type: "apodTitle", payload: title });
    setTimeout(()=> {
      sendToClient(clientId, { type: "apodExplanation", payload: explanation });
    },5000);

    res.json({ hdurl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch APOD data" });
  }
});

export default router;