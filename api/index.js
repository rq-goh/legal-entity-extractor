import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from '../server/routes/upload.js';
import extractionRoutes from '../server/routes/extraction.js';
import githubRoutes from '../server/routes/github.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/extraction', extractionRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
