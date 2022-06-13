import express from 'express';
import { usersRoute, producersRoute, reviewsRoute, winesRoute } from './routes/index.js';
import cors from "cors";
import {usersController} from "./controllers/index.js";

const createServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/users', usersRoute);
  app.use('/api/producers', producersRoute);
  app.use('/api/wines', winesRoute);
  app.use('/api/reviews', reviewsRoute);
  app.post('/api/register', usersController.createUser);
  app.post('/api/login', usersController.login);
  return app;
}

export default createServer;
