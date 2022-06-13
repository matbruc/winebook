import express from 'express';

import { usersController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get('/', authMiddleware.verifyToken, authMiddleware.verifyAdmin, usersController.getUsers);
router.get('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, usersController.getUser);
router.patch('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, usersController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, usersController.deleteUser);

export default router;
