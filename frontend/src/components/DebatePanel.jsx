import React from 'react';
import { Bot, HelpCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DebatePanel({ analyst, strategistInitial, devil, strategistFinal }) {
  if (!analyst && !strategistInitial && !devil && !strategistFinal) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <Bot className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <p className="text-sm font-semibold">No debate session loaded.</p>
        <p className="text-xs text-slate-600 max-w-xs mt-1">
          Simulate a strategy recommendation to watch the Gemini agents argue here!
        </p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Step 1: Analyst Agent */}
      {analyst && (
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-2xl border border-blue-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
              🤖 Agent 1: Matchup Analyst
            </h4>
          </div>
          <div className="text-xs text-gray-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-white/5 whitespace-pre-line leading-relaxed">
            {analyst}
          </div>
        </motion.div>
      )}

      {/* Step 2: Strategist Initial */}
      {strategistInitial && (
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-2xl border border-teal-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              🧢 Agent 2: Captain (Initial Proposal)
            </h4>
          </div>
          <div className="text-xs text-gray-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-white/5 whitespace-pre-line leading-relaxed">
            {strategistInitial}
          </div>
        </motion.div>
      )}

      {/* Step 3: Devil's Advocate */}
      {devil && (
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-2xl border border-red-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
              🧨 Agent 3: Devil’s Advocate (Objections)
            </h4>
          </div>
          <div className="text-xs text-gray-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-red-500/10 whitespace-pre-line leading-relaxed">
            {devil}
          </div>
        </motion.div>
      )}

      {/* Step 4: Strategist Final */}
      {strategistFinal && (
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-2xl border border-purple-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              🛡️ Agent 4: Captain (Final Revised Call)
            </h4>
          </div>
          <div className="text-xs text-gray-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-white/5 whitespace-pre-line leading-relaxed">
            {strategistFinal}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
