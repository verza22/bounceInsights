import { Router, Request, Response } from 'express';
import { fetchWithFallback, validateLanguage } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { OpenAIClient } from '../utils/openAIClient';

const router = Router();
const openaiClient = OpenAIClient.getInstance();

router.get("/quiz", async (req: Request, res: Response) => {
  const { dateFrom, clientId, currentLang } = req.query as { dateFrom: string, clientId: string, currentLang: string };

  const { valid } = validateFields(req.query, [
    { field: 'dateFrom', type: 'string', required: true },
    { field: 'clientId', type: 'string', required: true },
    { field: 'currentLang', type: 'string', required: true }
  ]);

  if (!valid) {
    res.status(400).json({ error: 'error.400' });
  }

  const lang = validateLanguage(currentLang);
  if(lang === "")
    res.status(500).json({ error: 'error.500-001' });

  const url = `planetary/apod?date=${dateFrom}&api_key=${process.env.NASA_API_TOKEN}`;
  const fallback = "./responses/apod.json";

  try {
    const data = await fetchWithFallback(url, fallback);

    const { explanation } = data;

    const result = await openaiClient.generateTrueAndFalseStatements(explanation);

    let translatedResult = result;
    if(lang !== "ENG"){
        translatedResult = await openaiClient.translateText(result, lang);
    }

    res.json({ explanation: translatedResult });
  } catch (err) {
    res.status(500).json({ error: 'error.500-002' });
  }
});

export default router;