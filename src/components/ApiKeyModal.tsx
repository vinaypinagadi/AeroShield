import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, X, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import { getActiveApiKey, isKeyPersistedInLocalStorage, setActiveApiKey } from '../services/aiSmogService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getActiveApiKey();
      setHasExistingKey(!!existing);
      setApiKey(existing || '');
      setRememberKey(isKeyPersistedInLocalStorage());
      setSaveSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveApiKey(apiKey.trim() || null, rememberKey);
    setSaveSuccess(true);
    setTimeout(() => {
      onKeySaved();
      onClose();
    }, 400);
  };

  const handleClear = () => {
    setActiveApiKey(null);
    setApiKey('');
    setHasExistingKey(false);
    onKeySaved();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-xl font-bold tracking-tight text-white">
              Google Gemini API Key (BYOK)
            </h2>
            <p className="text-xs text-slate-400">
              Bring Your Own Key for custom real-time AI synthesis
            </p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 mb-5 text-sm space-y-2">
          <div className="flex items-start space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong className="text-emerald-300">Zero Server-Side Storage:</strong> Your key is stored strictly in your browser&apos;s client memory (<code className="text-slate-200">sessionStorage</code> or <code className="text-slate-200">localStorage</code>) and transmitted directly to Google&apos;s Gemini API endpoint over HTTPS.
            </p>
          </div>
          <div className="flex items-start space-x-2 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Demo Mode Available:</strong> Evaluators can test every feature instantly without any key using the verified presets.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono transition-all"
            />
            <p className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Get a free key from Google AI Studio</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline inline-flex items-center space-x-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              id="remember-key-checkbox"
              type="checkbox"
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-700 rounded focus:ring-emerald-500"
            />
            <label htmlFor="remember-key-checkbox" className="text-xs text-slate-300 select-none cursor-pointer">
              Remember key in local storage across browser reloads
            </label>
          </div>

          {saveSuccess && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg font-medium text-center">
              API key successfully saved!
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {hasExistingKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-md transition-all"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
