import { Router, Request, Response } from 'express';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';
import { NASA_API_TOKEN } from '../config';

const router = Router();

router.get("/neo", async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    const { valid, errors } = validateFields(req.query, [
        { field: 'dateFrom', type: 'string', required: true },
        { field: 'dateTo', type: 'string', required: true },
    ]);

    if (!valid) {
        res.status(400).json({ errors });
    }

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateFrom}&end_date=${dateTo}&api_key=${NASA_API_TOKEN}`;
    const fallback = "./responses/neo.json";

    try {
        const data = await fetchWithFallback(url, fallback);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los datos de NEO" });
    }
});

export default router;