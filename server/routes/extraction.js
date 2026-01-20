import express from 'express';
import { extractEntities } from '../utils/openai-client.js';
import { validateMermaidDiagram, extractEntityStats } from '../utils/mermaid-validator.js';
import { checkRateLimit, validateTextLength } from '../utils/security.js';

const router = express.Router();

/**
 * POST /api/extraction/extract
 * Extract entities from documents using OpenAI API
 */
router.post('/extract', async (req, res) => {
  try {
    const { documents, apiKey, model } = req.body;

    if (!documents || documents.length === 0) {
      return res.status(400).json({ error: 'No documents provided' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    // Check rate limit (10 requests per minute per IP)
    const clientIp = req.ip || req.connection.remoteAddress;
    const rateLimit = checkRateLimit(clientIp, 10, 60000);
    
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      });
    }

    // Validate text length
    const totalText = documents.reduce((sum, doc) => sum + doc.text.length, 0);
    const textValidation = validateTextLength(totalText);
    if (!textValidation.valid) {
      return res.status(400).json({ error: textValidation.error });
    }

    // Call OpenAI API
    const result = await extractEntities({
      documents,
      apiKey,
      model: model || 'gpt-4o-mini',
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Validate Mermaid diagram
    const validation = validateMermaidDiagram(result.mermaidCode);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Diagram validation failed',
        details: validation.errors,
      });
    }

    // Extract statistics
    const stats = extractEntityStats(result.mermaidCode);

    res.json({
      success: true,
      mermaidCode: result.mermaidCode,
      entities: result.entities,
      relationships: result.relationships,
      stats,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
    });
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/extraction/validate
 * Validate Mermaid diagram syntax
 */
router.post('/validate', (req, res) => {
  try {
    const { mermaidCode } = req.body;

    if (!mermaidCode) {
      return res.status(400).json({ error: 'Mermaid code required' });
    }

    const validation = validateMermaidDiagram(mermaidCode);
    const stats = extractEntityStats(mermaidCode);

    res.json({
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      stats,
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
