import express from "express";

import { reviewsController } from "../controllers/index.js";

const router = express.Router();

router.get("/", reviewsController.getReviews);
router.get("/:id", reviewsController.getReview);
router.post("/", reviewsController.createReview);
router.patch("/:id", reviewsController.updateReview);
router.delete("/:id", reviewsController.deleteReview);

export default router;
