import express from "express";

import { producersController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, producersController.getProducers);
router.get("/:id", authMiddleware.verifyToken, producersController.getProducer);
router.post("/", authMiddleware.verifyToken, producersController.createProducer);
router.patch("/:id", authMiddleware.verifyToken, producersController.updateProducer);
router.delete("/:id", authMiddleware.verifyToken, producersController.deleteProducer);

export default router;
