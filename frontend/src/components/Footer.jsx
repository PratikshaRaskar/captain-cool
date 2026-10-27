import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel mt-12 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
      <div className="flex items-center gap-1.5">
        <span>Built for IPL Hackathon with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
        <span>by Google Antigravity Agent</span>
      </div>

      <div className="flex items-center gap-4">
        <a href="#docs" className="hover:text-cyan-400 transition-colors">FastAPI Backend Documentation</a>
        <span>•</span>
        <div className="flex items-center gap-1 text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash API</span>
        </div>
      </div>
    </footer>
  );
}
