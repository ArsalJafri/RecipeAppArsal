import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import { userRouter } from './routes/user.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Database connection
mongoose.connect(process.env.MONGODB_URI);

// Serverless handler
export const handler = serverless(app);

