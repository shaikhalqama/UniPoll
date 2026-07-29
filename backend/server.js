import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import pollRouter from './routes/pollRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import userRouter from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
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

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve frontend for all non-API routes (SPA routing)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
