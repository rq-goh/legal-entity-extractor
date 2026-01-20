import express from 'express';
import multer from 'multer';
import { extractTextFromDocument, validateFileType } from '../utils/document-extractor.js';
import { validateFileCount, validateFileSize, RATE_LIMITS } from '../utils/security.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!validateFileType(file.originalname)) {
      cb(new Error(`Invalid file type: ${file.originalname}`));
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: RATE_LIMITS.UPLOAD_SIZE_MB * 1024 * 1024,
  },
});

/**
 * POST /api/upload/documents
 * Upload and extract text from documents
 */
router.post('/documents', upload.array('files', RATE_LIMITS.MAX_FILES_PER_UPLOAD), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Validate file count
    const countValidation = validateFileCount(req.files.length);
    if (!countValidation.valid) {
      return res.status(400).json({ error: countValidation.error });
    }

    // Extract text from all files
    const extractedDocs = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Validate file size
        const sizeValidation = validateFileSize(file.size);
        if (!sizeValidation.valid) {
          errors.push({ file: file.originalname, error: sizeValidation.error });
          continue;
        }

        // Extract text
        const extracted = await extractTextFromDocument(
          file.buffer,
          file.originalname,
          file.mimetype
        );

        if (extracted.success) {
          extractedDocs.push(extracted);
        } else {
          errors.push({ file: file.originalname, error: extracted.error });
        }
      } catch (error) {
        errors.push({ file: file.originalname, error: error.message });
      }
    }

    if (extractedDocs.length === 0) {
      return res.status(400).json({
        error: 'Failed to extract text from any files',
        details: errors,
      });
    }

    res.json({
      success: true,
      documents: extractedDocs,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
