import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

/**
 * Upload documents for text extraction
 */
export async function uploadDocuments(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await api.post('/upload/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Extract entities from documents
 */
export async function extractEntities(documents, apiKey, model) {
  const response = await api.post('/extraction/extract', {
    documents,
    apiKey,
    model,
  });

  return response.data;
}

/**
 * Validate Mermaid diagram
 */
export async function validateDiagram(mermaidCode) {
  const response = await api.post('/extraction/validate', {
    mermaidCode,
  });

  return response.data;
}

/**
 * Upload diagram to GitHub
 */
export async function uploadToGitHub(mermaidCode, fileName, token, username, repo) {
  const response = await api.post('/github/upload', {
    mermaidCode,
    fileName,
    token,
    username,
    repo,
  });

  return response.data;
}

/**
 * Test GitHub connection
 */
export async function testGitHubConnection(token, username, repo) {
  const response = await api.post('/github/test', {
    token,
    username,
    repo,
  });

  return response.data;
}

/**
 * Test OpenAI API key (via backend)
 */
export async function testApiKey(apiKey, model) {
  try {
    const response = await api.post('/extraction/extract', {
      documents: [{ fileName: 'test.txt', text: 'Test' }],
      apiKey,
      model,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export default api;
