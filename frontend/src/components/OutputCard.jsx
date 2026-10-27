import React from 'react';
import { Volume2, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OutputCard({ finalOutput }) {
  if (!finalOutput) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <Volume2 className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <p className="text-sm font-semibold">No strategizing output available yet.</p>
        <p className="text-xs text-slate-600 max-w-xs mt-1">
          Adjust the parameters on the left and click "Get Captain's Call" to trigger the debate loop!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 rounded-2xl border border-cyan-500/10 shadow-lg shadow-cyan-500/5 relative overflow-hidden"
    >
      {/* Decorative top border highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 shadow-glowCyan"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Volume2 className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-wide text-white uppercase">
              🎙️ Live Match Commentary
            </h3>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              High-Octane Cricket Explainer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-glowCyan">
          <Zap className="w-3 h-3 fill-current" />
          <span>FANS APPROVED</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-slate-950/70 p-5 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-200 whitespace-pre-line font-mono max-h-[500px] overflow-y-auto tracking-wide scrollbar-thin">
        {finalOutput}
      </div>
    </motion.div>
  );
}
