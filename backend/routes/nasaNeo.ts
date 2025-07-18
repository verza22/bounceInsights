import { Router, Request, Response } from 'express';
import moment from 'moment';
import { fetchWithFallback } from '../utils/utils';
import { validateFields } from '../utils/validateFields';

const router = Router();

router.get("/neo", async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    const { valid } = validateFields(req.query, [
        { field: 'dateFrom', type: 'string', required: true },
        { field: 'dateTo', type: 'string', required: true },
    ]);

    if (!valid) {
        res.status(400).json({ error: 'error.400' });
    }

    const start = moment(dateFrom as string, "YYYY-MM-DD", true);
    const end = moment(dateTo as string, "YYYY-MM-DD", true);

    if (!start.isValid() || !end.isValid()) {
        res.status(400).json({ error: 'error.400-002' });
    }

    let adjustedEnd = end;

    if (end.diff(start, 'days') > 7) {
        adjustedEnd = start.clone().add(7, 'days');
    }

    const url = `neo/rest/v1/feed?start_date=${start.format("YYYY-MM-DD")}&end_date=${adjustedEnd.format("YYYY-MM-DD")}&api_key=${process.env.NASA_API_TOKEN}`;
    const fallback = "./responses/neo.json";

    try {
        const data = await fetchWithFallback(url, fallback);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'error.500-002' });
    }
});

export default router;