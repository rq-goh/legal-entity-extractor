import mammoth from 'mammoth';

/**
 * Extract text from document buffer
 */
export async function extractTextFromDocument(buffer, fileName, mimeType) {
  try {
    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'txt':
        return extractFromTxt(buffer, fileName);
      case 'pdf':
        return extractFromPdf(buffer, fileName);
      case 'docx':
        return await extractFromDocx(buffer, fileName);
      default:
        return {
          fileName,
          text: '',
          success: false,
          error: `Unsupported file type: .${extension}`,
        };
    }
  } catch (error) {
    return {
      fileName,
      text: '',
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Extract text from TXT file
 */
function extractFromTxt(buffer, fileName) {
  try {
    const text = buffer.toString('utf8');
    return { fileName, text, success: true };
  } catch (error) {
    return {
      fileName,
      text: '',
      success: false,
      error: `Failed to read TXT file: ${error.message}`,
    };
  }
}

/**
 * Extract text from PDF file
 * Note: Basic PDF text extraction. For complex PDFs, consider using specialized services.
 */
function extractFromPdf(buffer, fileName) {
  try {
    const text = buffer.toString('utf8');
    
    // Extract text from PDF stream objects
    let extractedText = '';
    const streamMatches = text.match(/stream([\s\S]*?)endstream/g);
    
    if (streamMatches) {
      for (const stream of streamMatches) {
        const readable = stream.match(/[\x20-\x7E]{3,}/g);
        if (readable) {
          extractedText += readable.join(' ') + ' ';
        }
      }
    }

    // Fallback: extract readable text sequences
    if (!extractedText) {
      const readableText = text.match(/[A-Za-z0-9\s,.;:!?()\[\]{}"'-]{10,}/g);
      if (readableText) {
        extractedText = readableText.join(' ');
      }
    }

    if (!extractedText.trim()) {
      return {
        fileName,
        text: '',
        success: false,
        error: 'Unable to extract text from PDF. The file may be scanned or image-based.',
      };
    }

    return {
      fileName,
      text: extractedText.trim(),
      success: true,
    };
  } catch (error) {
    return {
      fileName,
      text: '',
      success: false,
      error: `Failed to extract from PDF: ${error.message}`,
    };
  }
}

/**
 * Extract text from DOCX file using mammoth
 */
async function extractFromDocx(buffer, fileName) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      fileName,
      text: result.value,
      success: true,
    };
  } catch (error) {
    return {
      fileName,
      text: '',
      success: false,
      error: `Failed to extract from DOCX: ${error.message}`,
    };
  }
}

/**
 * Validate file type
 */
export function validateFileType(fileName) {
  const extension = fileName.toLowerCase().split('.').pop();
  return ['txt', 'pdf', 'docx'].includes(extension || '');
}
