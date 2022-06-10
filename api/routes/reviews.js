import express from "express";

import { reviewsController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, reviewsController.getReviews);
router.get("/:id", authMiddleware.verifyToken, reviewsController.getReview);
router.post("/", authMiddleware.verifyToken, reviewsController.createReview);
router.patch("/:id", authMiddleware.verifyToken, reviewsController.updateReview);
router.delete("/:id", authMiddleware.verifyToken, reviewsController.deleteReview);

export default router;
