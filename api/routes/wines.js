import express from "express";

import { winesController } from "../controllers/index.js";

const router = express.Router();

router.get("/", winesController.getWines);
router.get("/:id", winesController.getWine);
router.post("/", winesController.createWine);
router.patch("/:id", winesController.updateWine);
router.delete("/:id", winesController.deleteWine);

export default router;
