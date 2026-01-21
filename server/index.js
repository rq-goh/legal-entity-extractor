import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.js';
import extractionRoutes from './routes/extraction.js';
import githubRoutes from './routes/github.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve static files from client build
// Use project root directory (working directory)
let projectRoot = process.cwd();
console.log('='.repeat(50));
console.log('Initial cwd:', projectRoot);

// If we're in a src subdirectory, go up to parent
if (projectRoot.endsWith('/src') || projectRoot.endsWith('\\src')) {
  projectRoot = path.dirname(projectRoot);
  console.log('Adjusted to parent directory:', projectRoot);
}

const clientBuildPath = path.join(projectRoot, 'client', 'dist');
console.log('Client build path:', clientBuildPath);
console.log('Client dist exists:', fs.existsSync(clientBuildPath));

// List directory contents for debugging
if (fs.existsSync(path.join(projectRoot, 'client'))) {
  console.log('Contents of client/:', fs.readdirSync(path.join(projectRoot, 'client')));
} else {
  console.warn('⚠️  client/ directory not found');
}

const indexPath = path.join(clientBuildPath, 'index.html');
console.log('index.html path:', indexPath);
console.log('index.html exists:', fs.existsSync(indexPath));
console.log('='.repeat(50));

app.use(express.static(clientBuildPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('❌ index.html not found at:', indexPath);
    res.status(404).json({ 
      error: 'index.html not found', 
      path: indexPath, 
      cwd: process.cwd(),
      clientBuildPath: clientBuildPath,
      exists: fs.existsSync(clientBuildPath),
      debug: {
        projectRoot: projectRoot,
        clientDirExists: fs.existsSync(path.join(projectRoot, 'client')),
        clientContents: fs.existsSync(path.join(projectRoot, 'client')) ? fs.readdirSync(path.join(projectRoot, 'client')) : 'N/A'
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
