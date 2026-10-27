import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Zap, Key, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState('simulated'); // 'simulated' or 'live'

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
    
    const savedMode = localStorage.getItem('presentation_mode') || 'simulated';
    setMode(savedMode);
  }, []);

  const handleKeyChange = (val) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const toggleMode = () => {
    const newMode = mode === 'simulated' ? 'live' : 'simulated';
    setMode(newMode);
    localStorage.setItem('presentation_mode', newMode);
    // Dispatch custom event to notify App.jsx if needed, or simply reload local state
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex flex-col lg:flex-row items-center justify-between shadow-lg shadow-black/20 gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-glowCyan">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              CAPTAIN COOL
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
              v1.2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Multi-Agent IPL Match Strategist — Powered by Google Gemini
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Mode Selector Toggle Switch */}
        <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-1 gap-1 w-full sm:w-auto">
          <button
            onClick={() => {
              setMode('simulated');
              localStorage.setItem('presentation_mode', 'simulated');
              window.dispatchEvent(new Event('storage'));
            }}
            className={`flex-1 sm:flex-initial text-xs px-3.5 py-1.5 rounded-lg font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
              mode === 'simulated'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-glowCyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulated Demo</span>
          </button>
          <button
            onClick={() => {
              setMode('live');
              localStorage.setItem('presentation_mode', 'live');
              window.dispatchEvent(new Event('storage'));
            }}
            className={`flex-1 sm:flex-initial text-xs px-3.5 py-1.5 rounded-lg font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
              mode === 'live'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-glowCyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Gemini</span>
          </button>
        </div>

        {/* Custom API Key Input field */}
        <div className="relative flex items-center w-full sm:w-60">
          <Key className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <input
            type="password"
            placeholder="Gemini API Key override..."
            value={apiKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            disabled={mode === 'simulated'}
            className={`w-full text-xs pl-9 pr-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:shadow-glowCyan/20 transition-all font-mono ${
              mode === 'simulated' ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          />
          {apiKey.trim() && mode === 'live' && (
            <span className="absolute right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>{mode === 'simulated' ? "DEMO SELECTION ACTIVE" : (apiKey.trim() ? "CUSTOM KEY ACTIVE" : "GEMINI ACTIVE")}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
