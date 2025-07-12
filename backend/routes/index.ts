import { Router } from 'express';
import apod from './nasaApod';
import neo from './nasaNeo';
import cme from './nasaCme';
import gst from './nasaGst';
import insight from './nasaInsight';
import curiosity from './nasaCuriosity';
import quiz from './nasaQuiz';

const router = Router();

// Router base /nasa/*
router.use('/nasa', apod);
router.use('/nasa', neo);
router.use('/nasa', cme);
router.use('/nasa', gst);
router.use('/nasa', insight);
router.use('/nasa', curiosity);
router.use('/nasa', quiz);

export default router;