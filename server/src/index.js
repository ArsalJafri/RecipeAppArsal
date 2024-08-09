//index.js which is inside my src folder which is in my server folder

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import { userRouter } from './routes/user.js';
import { recipesRouter } from './routes/recipes.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Serverless handler
export const handler = serverless(app);
