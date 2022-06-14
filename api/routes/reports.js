import express from 'express';

import { reportsController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get('/winesPerProducer', authMiddleware.verifyToken, authMiddleware.verifyAdmin, reportsController.getWinesPerProducer);
router.get('/winesPerRegion', authMiddleware.verifyToken, authMiddleware.verifyAdmin, reportsController.getWinesPerRegion);
router.get('/winesPerSubregion', authMiddleware.verifyToken, authMiddleware.verifyAdmin, reportsController.getWinesPerSubregion);
router.get('/topWines', authMiddleware.verifyToken, authMiddleware.verifyAdmin, reportsController.getTopWines);

export default router;
