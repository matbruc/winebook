import express from "express";
import { producersController } from "../controllers/index.js";

const router = express.Router();

router.get("/", producersController.getProducers);
router.get("/:id", producersController.getProducer);
router.post("/", producersController.createProducer);
router.patch("/:id", producersController.updateProducer);
router.delete("/:id", producersController.deleteProducer);

export default router;
