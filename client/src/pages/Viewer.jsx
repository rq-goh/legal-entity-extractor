import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MermaidViewer from '../components/MermaidViewer';
import { uploadToGitHub } from '../api';

export default function Viewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [extraction, setExtraction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const extractions = JSON.parse(localStorage.getItem('extractions') || '[]');
    const found = extractions.find((e) => e.id === id);
    if (found) {
      setExtraction(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleCopyCode = async () => {
    if (!extraction) return;
    try {
      await navigator.clipboard.writeText(extraction.mermaidCode);
      alert('Mermaid code copied to clipboard!');
    } catch (err) {
      alert('Failed to copy code');
    }
  };

  const handleUploadToGitHub = async () => {
    if (!extraction) return;

    try {
      setUploading(true);
      setError('');

      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      if (!settings.githubToken || !settings.githubUsername || !settings.githubRepo) {
        setError('Please configure GitHub settings first');
        setUploading(false);
        return;
      }

      const result = await uploadToGitHub(
        extraction.mermaidCode,
        extraction.fileNames[0],
        settings.githubToken,
        settings.githubUsername,
        settings.githubRepo
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      alert(`Uploaded to GitHub!\n\n${result.url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!extraction) {
    return (
      <div className="py-12 px-4 text-center">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline mb-4"
          >
            ← Back
          </button>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{extraction.fileNames[0]}</h1>
              {extraction.fileNames.length > 1 && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  +{extraction.fileNames.length - 1} more file{extraction.fileNames.length > 2 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                title="Copy Mermaid code"
              >
                📋
              </button>
              <button
                onClick={handleUploadToGitHub}
                disabled={uploading}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                title="Upload to GitHub"
              >
                {uploading ? '⏳' : '🔗'}
              </button>
            </div>
          </div>

          <div className="flex gap-6 text-sm mb-4">
            <span className="text-slate-600 dark:text-slate-400">
              🔷 {extraction.entityCount} entities
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              🔗 {extraction.relationshipCount} relationships
            </span>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Diagram Viewer */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <MermaidViewer mermaidCode={extraction.mermaidCode} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
