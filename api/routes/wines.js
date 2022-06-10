import express from "express";

import { winesController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, winesController.getWines);
router.get("/:id", authMiddleware.verifyToken, winesController.getWine);
router.post("/", authMiddleware.verifyToken, winesController.createWine);
router.patch("/:id", authMiddleware.verifyToken, winesController.updateWine);
router.delete("/:id", authMiddleware.verifyToken, winesController.deleteWine);

export default router;
