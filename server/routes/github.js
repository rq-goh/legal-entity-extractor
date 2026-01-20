import express from 'express';
import { uploadToGitHub, testGitHubConnection } from '../utils/github-client.js';

const router = express.Router();

/**
 * POST /api/github/upload
 * Upload Mermaid diagram to GitHub
 */
router.post('/upload', async (req, res) => {
  try {
    const { mermaidCode, fileName, token, username, repo } = req.body;

    if (!mermaidCode || !fileName || !token || !username || !repo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await uploadToGitHub(
      { token, username, repo },
      mermaidCode,
      fileName
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error('GitHub upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/github/test
 * Test GitHub connection and permissions
 */
router.post('/test', async (req, res) => {
  try {
    const { token, username, repo } = req.body;

    if (!token || !username || !repo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await testGitHubConnection({ token, username, repo });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      message: 'GitHub connection successful',
    });
  } catch (error) {
    console.error('GitHub test error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
