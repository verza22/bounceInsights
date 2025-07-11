import { Router, Request, Response } from 'express';
import { fetchWithFallback, validateLanguage } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { OpenAIClient } from '../utils/openAIClient';
import { sendToClient } from '../sockets/websocket';

const router = Router();
const openaiClient = OpenAIClient.getInstance();

router.get("/apod", async (req: Request, res: Response) => {
  const { dateFrom, clientId, currentLang } = req.query as { dateFrom: string, clientId: string, currentLang: string };

  const { valid, errors } = validateFields(req.query, [
    { field: 'dateFrom', type: 'string', required: true },
    { field: 'clientId', type: 'string', required: true },
    { field: 'currentLang', type: 'string', required: true }
  ]);

  if (!valid) {
    res.status(400).json({ errors });
  }

  const lang = validateLanguage(currentLang);
  if(lang === "")
    res.status(500).json({ error: "The selected language is not supported" });

  const url = `https://api.nasa.gov/planetary/apod?date=${dateFrom}&api_key=${process.env.NASA_API_TOKEN}`;
  const fallback = "./responses/apod.json";

  try {
    const data = await fetchWithFallback(url, fallback);

    const { hdurl, title, explanation } = data;

    if(lang === "ENG"){
      sendToClient(clientId, { type: "apodTitle", payload: title });
      sendToClient(clientId, { type: "apodExplanation", payload: explanation });
    }else{
      openaiClient.sendTranslateText(clientId, "apodTitle", title, lang);
      openaiClient.sendTranslateText(clientId, "apodExplanation", explanation, lang);
    }

    res.json({ hdurl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch APOD data" });
  }
});

export default router;