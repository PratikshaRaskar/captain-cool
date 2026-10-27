import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  { text: "CRUNCHING NUMBERS: Running win probability model...", color: "text-cyan-400" },
  { text: "INVOKING ANALYST: Gemini querying match-up history via WinProb tool...", color: "text-blue-400" },
  { text: "CAPTAIN PROPOSING: Formulating initial bowling and field placement...", color: "text-teal-400" },
  { text: "DEVIL CHALLENGING: Opposition strategist attacking the weaknesses...", color: "text-red-400" },
  { text: "REVISING DECISION: Strategist adjusting bowler selections for final call...", color: "text-purple-400" },
  { text: "SPINNING PLOTS: Synthesizing commentator cricket commentary...", color: "text-amber-400" }
];

export default function Loader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 7000); // Rotate messages every 7 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-darkBg/80 backdrop-blur-md">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col items-center text-center">
        {/* Animated Spin Ring */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          <Bot className="w-8 h-8 text-cyan-400" />
        </div>

        <h3 className="text-xl font-bold tracking-wider text-white mb-2">
          Coordinating Multi-Agent Debate Loop
        </h3>
        
        <p className="text-xs text-gray-400 max-w-xs mb-6">
          Google Gemini 2.5 Flash is actively executing a collaborative multi-agent simulation.
        </p>

        {/* Step Indicator */}
        <div className="w-full h-8 flex items-center justify-center overflow-hidden bg-slate-950/60 border border-white/5 rounded-lg py-1 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`text-xs font-mono font-bold tracking-wide uppercase ${LOADING_STEPS[currentStep].color}`}
            >
              {LOADING_STEPS[currentStep].text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Static decorative loader line */}
        <div className="w-full h-1 bg-slate-900 overflow-hidden rounded-full mt-6">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-500 animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}
