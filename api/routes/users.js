import express from 'express';

import { usersController } from "../controllers/index.js";

const router = express.Router();

// TODO: replace id for username
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;
