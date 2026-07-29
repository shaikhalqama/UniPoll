import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../backend/config/db.js';
import authRouter from '../backend/routes/authRoutes.js';
import notificationRouter from '../backend/routes/notificationRoutes.js';
import pollRouter from '../backend/routes/pollRoutes.js';
import commentRouter from '../backend/routes/commentRoutes.js';
import userRouter from '../backend/routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/polls', pollRouter);
app.use('/api/comments', commentRouter);
app.use('/api/users', userRouter);
app.use('/api/notifications', notificationRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
