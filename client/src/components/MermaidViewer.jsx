import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidViewer({ mermaidCode, searchQuery = '' }) {
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mermaidCode) return;

    const renderDiagram = async () => {
      try {
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        mermaid.contentLoaded();
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err.message);
      }
    };

    renderDiagram();
  }, [mermaidCode]);

  const highlightedCode = searchQuery
    ? mermaidCode.replace(
        new RegExp(`(${searchQuery})`, 'gi'),
        '<mark style="background-color: yellow;">$1</mark>'
      )
    : mermaidCode;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg">
      {/* Controls */}
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          −
        </button>
        <span className="text-sm font-medium w-16 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale(Math.min(2, scale + 0.1))}
          className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          +
        </button>
        <button
          onClick={() => setScale(1)}
          className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 ml-2"
        >
          Reset
        </button>
        {searchQuery && (
          <div className="ml-auto text-sm text-slate-600 dark:text-slate-400">
            Searching for: <span className="font-semibold">{searchQuery}</span>
          </div>
        )}
      </div>

      {/* Diagram Container */}
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
            <p className="font-semibold">Error rendering diagram:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <div
            className="mermaid"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            dangerouslySetInnerHTML={{ __html: `\`\`\`mermaid\n${mermaidCode}\n\`\`\`` }}
          />
        )}
      </div>

      {/* Code Display */}
      <details className="border-t border-slate-200 dark:border-slate-800">
        <summary className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold">
          View Mermaid Code
        </summary>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <pre className="text-xs overflow-auto max-h-48 p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
            <code>{mermaidCode}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}
