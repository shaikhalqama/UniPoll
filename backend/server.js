import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('backend server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
