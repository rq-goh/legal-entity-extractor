import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [extractions, setExtractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExtractions();
  }, []);

  const loadExtractions = () => {
    try {
      const stored = localStorage.getItem('extractions');
      if (stored) {
        const parsed = JSON.parse(stored);
        setExtractions(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load extractions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this extraction?')) {
      const updated = extractions.filter((e) => e.id !== id);
      setExtractions(updated);
      localStorage.setItem('extractions', JSON.stringify(updated));
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Legal Entity Extractor</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Extract entities from legal documents and visualize relationships
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to="/upload"
          className="inline-block mb-12 px-8 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition text-lg font-semibold"
        >
          📄 New Extraction
        </Link>

        {/* Recent Extractions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Extractions</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : extractions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-4xl mb-4">📊</p>
              <p className="text-slate-600 dark:text-slate-400">
                No extractions yet
                <br />
                <Link to="/upload" className="text-primary hover:underline">
                  Create your first extraction
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {extractions.map((extraction) => (
                <Link
                  key={extraction.id}
                  to={`/viewer/${extraction.id}`}
                  className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{extraction.fileNames[0]}</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(extraction.timestamp)}
                    </span>
                  </div>

                  {extraction.fileNames.length > 1 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      +{extraction.fileNames.length - 1} more file{extraction.fileNames.length > 2 ? 's' : ''}
                    </p>
                  )}

                  <div className="flex gap-6 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      🔷 {extraction.entityCount} entities
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      🔗 {extraction.relationshipCount} relationships
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(extraction.id);
                    }}
                    className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
