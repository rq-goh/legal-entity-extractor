/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  API_CALLS_PER_MINUTE: 10,
  API_CALLS_PER_HOUR: 50,
  UPLOAD_SIZE_MB: 10,
  MAX_FILES_PER_UPLOAD: 5,
  MAX_TEXT_LENGTH: 100000,
};

const rateLimits = new Map();

/**
 * Check if rate limit is exceeded
 */
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimits.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  rateLimits.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(sizeBytes) {
  const sizeMB = sizeBytes / (1024 * 1024);

  if (sizeMB > RATE_LIMITS.UPLOAD_SIZE_MB) {
    return {
      valid: false,
      error: `File size exceeds limit of ${RATE_LIMITS.UPLOAD_SIZE_MB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file count
 */
export function validateFileCount(count) {
  if (count > RATE_LIMITS.MAX_FILES_PER_UPLOAD) {
    return {
      valid: false,
      error: `Maximum ${RATE_LIMITS.MAX_FILES_PER_UPLOAD} files allowed per upload`,
    };
  }

  if (count === 0) {
    return {
      valid: false,
      error: 'Please select at least one file',
    };
  }

  return { valid: true };
}

/**
 * Validate extracted text length
 */
export function validateTextLength(text) {
  if (text.length > RATE_LIMITS.MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text exceeds maximum length of ${RATE_LIMITS.MAX_TEXT_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input) {
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(key) {
  const sanitized = sanitizeInput(key);

  if (sanitized.length < 20) {
    return {
      valid: false,
      error: 'API key is too short',
    };
  }

  if (!/^[A-Za-z0-9_-]+$/.test(sanitized)) {
    return {
      valid: false,
      error: 'API key contains invalid characters',
    };
  }

  return { valid: true };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetTime) {
      rateLimits.delete(key);
    }
  }
}

// Clean up rate limits every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);
