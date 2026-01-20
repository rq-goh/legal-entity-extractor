import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocuments, extractEntities } from '../api';

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setError('');
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    try {
      if (files.length === 0) {
        setError('Please select at least one file');
        return;
      }

      setProcessing(true);
      setError('');

      // Get API key from localStorage
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      if (!settings.openaiApiKey) {
        setError('Please configure your OpenAI API key in Settings');
        setProcessing(false);
        return;
      }

      // Upload and extract text
      setProgress('Extracting text from documents...');
      const uploadResult = await uploadDocuments(files);

      if (!uploadResult.success || uploadResult.documents.length === 0) {
        throw new Error(uploadResult.error || 'Failed to extract text from documents');
      }

      // Extract entities
      setProgress('Analyzing entities with AI...');
      const extractionResult = await extractEntities(
        uploadResult.documents,
        settings.openaiApiKey,
        settings.openaiModel || 'gpt-4o-mini'
      );

      if (!extractionResult.success) {
        throw new Error(extractionResult.error);
      }

      // Save to localStorage
      const extraction = {
        id: Date.now().toString(),
        fileNames: files.map((f) => f.name),
        mermaidCode: extractionResult.mermaidCode,
        entityCount: Object.values(extractionResult.entities).reduce((a, b) => a + b, 0),
        relationshipCount: extractionResult.relationships,
        timestamp: Date.now(),
      };

      const extractions = JSON.parse(localStorage.getItem('extractions') || '[]');
      extractions.unshift(extraction);
      localStorage.setItem('extractions', JSON.stringify(extractions));

      // Navigate to viewer
      navigate(`/viewer/${extraction.id}`);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setProcessing(false);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Documents</h1>

        {/* File Input */}
        <label className="block mb-6 p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <div className="text-center">
            <p className="text-4xl mb-2">📁</p>
            <p className="font-semibold mb-1">Select Documents</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              .txt, .pdf, .docx files (max 10MB each, 5 files max)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".txt,.pdf,.docx"
            onChange={handleFileChange}
            disabled={processing}
            className="hidden"
          />
        </label>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Selected Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    disabled={processing}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Total: {totalSize.toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Progress */}
        {processing && (
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 dark:border-blue-100"></div>
              <p>{progress}</p>
            </div>
          </div>
        )}

        {/* Extract Button */}
        <button
          onClick={handleExtract}
          disabled={files.length === 0 || processing}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {processing ? 'Processing...' : 'Extract Entities'}
        </button>
      </div>
    </div>
  );
}
