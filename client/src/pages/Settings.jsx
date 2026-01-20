import React, { useState, useEffect } from 'react';
import { testApiKey, testGitHubConnection } from '../api';

const AVAILABLE_MODELS = [
  { label: 'GPT-4o Mini (Recommended)', value: 'gpt-4o-mini' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    githubToken: '',
    githubUsername: '',
    githubRepo: '',
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTestApiKey = async () => {
    setTesting(true);
    try {
      const result = await testApiKey(settings.openaiApiKey, settings.openaiModel);
      if (result.success) {
        setMessage('✓ API key is valid!');
      } else {
        setMessage(`✗ API key test failed: ${result.error}`);
      }
    } catch (err) {
      setMessage(`✗ Error: ${err.message}`);
    } finally {
      setTesting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTestGitHub = async () => {
    setTesting(true);
    try {
      const result = await testGitHubConnection(
        settings.githubToken,
        settings.githubUsername,
        settings.githubRepo
      );
      if (result.success) {
        setMessage('✓ GitHub connection successful!');
      } else {
        setMessage(`✗ GitHub test failed: ${result.error}`);
      }
    } catch (err) {
      setMessage(`✗ Error: ${err.message}`);
    } finally {
      setTesting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all data including settings and extraction history?')) {
      localStorage.clear();
      setSettings({
        openaiApiKey: '',
        openaiModel: 'gpt-4o-mini',
        githubToken: '',
        githubUsername: '',
        githubRepo: '',
      });
      setMessage('All data cleared!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.startsWith('✓')
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
          }`}>
            {message}
          </div>
        )}

        {/* OpenAI Configuration */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">OpenAI Configuration</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.openaiApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, openaiApiKey: e.target.value })
                }
                placeholder="sk-..."
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a>
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Model</label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((model) => (
                <label key={model.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    value={model.value}
                    checked={settings.openaiModel === model.value}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiModel: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span>{model.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleTestApiKey}
            disabled={!settings.openaiApiKey || testing}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {testing ? 'Testing...' : 'Test API Key'}
          </button>
        </div>

        {/* GitHub Configuration */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">GitHub Integration (Optional)</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">GitHub Token</label>
            <div className="flex gap-2">
              <input
                type={showGithubToken ? 'text' : 'password'}
                value={settings.githubToken}
                onChange={(e) =>
                  setSettings({ ...settings, githubToken: e.target.value })
                }
                placeholder="ghp_... or github_pat_..."
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowGithubToken(!showGithubToken)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {showGithubToken ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={settings.githubUsername}
              onChange={(e) =>
                setSettings({ ...settings, githubUsername: e.target.value })
              }
              placeholder="your-username"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Repository</label>
            <input
              type="text"
              value={settings.githubRepo}
              onChange={(e) =>
                setSettings({ ...settings, githubRepo: e.target.value })
              }
              placeholder="repository-name"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleTestGitHub}
            disabled={
              !settings.githubToken ||
              !settings.githubUsername ||
              !settings.githubRepo ||
              testing
            }
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Save Settings
          </button>

          <button
            onClick={handleClearAll}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
