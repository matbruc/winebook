import express from 'express';

import { usersController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get('/', authMiddleware.verifyToken, usersController.getUsers);
router.get('/:id', authMiddleware.verifyToken, usersController.getUser);
router.patch('/:id', authMiddleware.verifyToken, usersController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, usersController.deleteUser);

export default router;
