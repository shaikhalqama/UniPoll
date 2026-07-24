import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import pollRouter from './routes/pollRoutes.js';
 
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/polls', pollRouter);
app.use('/api/notifications', notificationRouter);

app.get('/', (req, res) => {
  res.send('backend server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
