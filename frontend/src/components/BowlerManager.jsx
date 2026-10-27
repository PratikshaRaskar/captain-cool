import React, { useState } from 'react';
import { UserPlus, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BowlerManager({ bowlers, setBowlers }) {
  const [name, setName] = useState('');
  const [oversUsed, setOversUsed] = useState(0);
  const [type, setType] = useState('pace');

  const handleAddBowler = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBowler = {
      name: name.trim(),
      overs_used: parseFloat(oversUsed) || 0,
      type
    };

    setBowlers([...bowlers, newBowler]);
    setName('');
    setOversUsed(0);
  };

  const handleRemoveBowler = (index) => {
    const updated = bowlers.filter((_, idx) => idx !== index);
    setBowlers(updated);
  };

  return (
    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-200 tracking-wide uppercase">
          ⚔️ Bowling Attack Roster
        </h4>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
          {bowlers.length} AVAILABLE
        </span>
      </div>

      {/* Add Bowler Form */}
      <form onSubmit={handleAddBowler} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        <div>
          <input
            type="text"
            placeholder="Bowler Name (e.g. Jadeja)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            max="4"
            placeholder="Overs Used"
            value={oversUsed || ''}
            onChange={(e) => setOversUsed(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="pace">Pace</option>
            <option value="spin">Spin</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg shadow-glowCyan transition-all duration-300 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Bowler
          </button>
        </div>
      </form>

      {/* Bowler List */}
      <div className="max-h-40 overflow-y-auto pr-1">
        {bowlers.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-500 border border-dashed border-white/5 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-500/60" />
            <span>No bowlers registered. Add at least one!</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {bowlers.map((bowler, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${bowler.type === 'spin' ? 'bg-emerald-400 shadow-glowCyan' : 'bg-cyan-400'}`}></span>
                    <span className="text-xs font-bold text-gray-100">{bowler.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({bowler.type.toUpperCase()})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-semibold">{bowler.overs_used} overs</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBowler(idx)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
