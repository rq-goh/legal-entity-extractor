import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xl font-bold text-primary">Legal Entity Extractor</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/upload"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              New Extraction
            </Link>
            <Link
              to="/settings"
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-primary transition"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
