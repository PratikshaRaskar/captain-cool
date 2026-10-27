import React, { useState } from 'react';
import OutputCard from './OutputCard';
import DebatePanel from './DebatePanel';
import StatsPanel from './StatsPanel';
import { Volume2, MessageSquare, BarChart3 } from 'lucide-react';

export default function OutputTabs({ response }) {
  const [activeTab, setActiveTab] = useState('decision');

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Header */}
      <div className="flex p-1 rounded-xl bg-slate-900/60 border border-white/5 shadow-inner">
        <button
          onClick={() => setActiveTab('decision')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
            activeTab === 'decision'
              ? 'bg-cyan-500 text-slate-950 shadow-glowCyan font-black scale-100'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Captain's Decision</span>
        </button>

        <button
          onClick={() => setActiveTab('debate')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
            activeTab === 'debate'
              ? 'bg-cyan-500 text-slate-950 shadow-glowCyan font-black scale-100'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Debate Room</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${
            activeTab === 'stats'
              ? 'bg-cyan-500 text-slate-950 shadow-glowCyan font-black scale-100'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Live Metrics</span>
        </button>
      </div>

      {/* Tabs Body */}
      <div className="flex-1">
        {activeTab === 'decision' && (
          <OutputCard finalOutput={response?.final_output} />
        )}
        {activeTab === 'debate' && (
          <DebatePanel
            analyst={response?.analyst}
            strategistInitial={response?.strategist_initial}
            devil={response?.devil}
            strategistFinal={response?.final_strategy}
          />
        )}
        {activeTab === 'stats' && (
          <StatsPanel stats={response?.stats} />
        )}
      </div>
    </div>
  );
}
