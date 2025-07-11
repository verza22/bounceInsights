import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { OpenAIClient } from '../utils/openAIClient';

const router = Router();
const openaiClient = OpenAIClient.getInstance();

router.get("/apod", async (req: Request, res: Response) => {
  const { dateFrom, clientId } = req.query as { dateFrom: string, clientId: string };

  const { valid, errors } = validateFields(req.query, [
    { field: 'dateFrom', type: 'string', required: true },
    { field: 'clientId', type: 'string', required: true }
  ]);

  if (!valid) {
    res.status(400).json({ errors });
  }

  const url = `https://api.nasa.gov/planetary/apod?date=${dateFrom}&api_key=${process.env.NASA_API_TOKEN}`;
  const fallback = "./responses/apod.json";

  try {
    const data = await fetchWithFallback(url, fallback);

    const { hdurl, title, explanation } = data;

    openaiClient.sendTranslateText(clientId, "apodTitle", title, "ESP");
    openaiClient.sendTranslateText(clientId, "apodExplanation", explanation, "ESP");

    res.json({ hdurl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch APOD data" });
  }
});

export default router;