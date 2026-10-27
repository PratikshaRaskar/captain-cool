import React from 'react';
import { Percent, TrendingUp, Gauge, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsPanel({ stats }) {
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <TrendingUp className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <p className="text-sm font-semibold">No analytics data calculated.</p>
        <p className="text-xs text-slate-600 max-w-xs mt-1">
          Crunch parameters on the left to compute live math probabilities.
        </p>
      </div>
    );
  }

  // Safely parse metrics
  const winProb = parseFloat(stats.win_probability) || 0;
  const bowlProb = parseFloat(stats.bowling_team_win_probability) || 0;
  const currentRR = parseFloat(stats.current_run_rate) || 0;
  const reqRR = parseFloat(stats.required_run_rate) || 0;
  const pressure = stats.pressure || 'LOW';
  const suggestedType = stats.suggested_bowling_type || 'spin';

  // Styles for pressure
  const getPressureStyles = (lvl) => {
    switch (lvl.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Visual Win Probability Bar */}
      <div className="glass-card p-6 rounded-2xl border border-white/5">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-cyan-400" />
          Live Win Probability
        </h4>
        <div className="flex justify-between items-center text-xs font-extrabold mb-2.5">
          <span className="text-cyan-400">CSK (BOWLING): {bowlProb}%</span>
          <span className="text-purple-400">MI (BATTING): {winProb}%</span>
        </div>
        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/5 flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bowlProb}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-teal-400"
          ></motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${winProb}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
          ></motion.div>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center italic">
          Calculated using wickets, run rate differential, dew factor, and pitch par scores.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current RR */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Current RR
          </span>
          <span className="text-2xl font-black text-white font-mono tracking-tight">{currentRR}</span>
          <span className="text-[10px] text-gray-500">runs per over</span>
        </div>

        {/* Required RR */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            Required RR
          </span>
          <span className="text-2xl font-black text-white font-mono tracking-tight">{reqRR}</span>
          <span className="text-[10px] text-gray-500">runs per over needed</span>
        </div>

        {/* Pressure Level */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Pressure Level
          </span>
          <span className={`self-start px-2.5 py-1 text-xs font-black uppercase tracking-wider border rounded-lg shadow-sm ${getPressureStyles(pressure)}`}>
            {pressure}
          </span>
        </div>

        {/* Suggested Bowler Type */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Best Bowler Type
          </span>
          <span className="self-start px-2.5 py-1 text-xs font-black uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10 rounded-lg">
            ⚡ {suggestedType}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
