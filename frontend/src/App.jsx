import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MatchForm from './components/MatchForm';
import OutputTabs from './components/OutputTabs';
import Loader from './components/Loader';
import Footer from './components/Footer';
import { getStrategy } from './api';
import { AlertOctagon, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Predefined Bowlers
const DEFAULT_BOWLERS = [
  { name: "Ravindra Jadeja", overs_used: 3.0, type: "spin" },
  { name: "Matheesha Pathirana", overs_used: 1.2, type: "pace" },
  { name: "Deepak Chahar", overs_used: 3.0, type: "pace" },
  { name: "Mitchell Santner", overs_used: 2.0, type: "spin" }
];

export default function App() {
  const [matchState, setMatchState] = useState({
    innings: 2,
    over: 15.2,
    score: 118,
    wickets: 5,
    target: 168,
    batting_team: "Mumbai Indians",
    bowling_team: "Chennai Super Kings",
    striker: "Hardik Pandya",
    non_striker: "Krunal Pandya",
    pitch: "turning",
    dew: "low",
    powerplay: false,
    death_overs: false,
    impact_player_available: true
  });

  const [bowlers, setBowlers] = useState(DEFAULT_BOWLERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [presentationMode, setPresentationMode] = useState(localStorage.getItem('presentation_mode') || 'simulated');

  // React to presentation mode toggler from Navbar
  useEffect(() => {
    const handleStorageChange = () => {
      setPresentationMode(localStorage.getItem('presentation_mode') || 'simulated');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Trigger E2E backend strategy call
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Structure state to match backend schema format
      const payload = {
        ...matchState,
        bowlers
      };

      const result = await getStrategy(payload);
      setResponse(result);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Unknown server error.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Load Demo scenario instantly
  const handleLoadPreset = () => {
    setMatchState({
      innings: 2,
      over: 15.2,
      score: 118,
      wickets: 5,
      target: 168,
      batting_team: "Mumbai Indians",
      bowling_team: "Chennai Super Kings",
      striker: "Hardik Pandya",
      non_striker: "Krunal Pandya",
      pitch: "turning",
      dew: "low",
      powerplay: false,
      death_overs: false,
      impact_player_available: true
    });
    setBowlers(DEFAULT_BOWLERS);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100 bg-[#0B0F19] relative overflow-hidden">
      {/* Decorative Background Glowing Blur Nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        
        {/* Error Alert Box */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-between gap-4 text-red-400 shadow-lg shadow-red-500/5"
            >
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold uppercase">Debate Pipeline Interrupted:</span> {error}
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400/60 hover:text-red-400 transition-colors p-1"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (5/12 width) */}
          <div className="lg:col-span-5">
            <MatchForm
              matchState={matchState}
              setMatchState={setMatchState}
              bowlers={bowlers}
              setBowlers={setBowlers}
              onSubmit={handleSubmit}
              onLoadPreset={handleLoadPreset}
            />
          </div>

          {/* Right Column: Output Strategy Panel (7/12 width) */}
          <div className="lg:col-span-7">
            {/* Show amber warning ONLY in live mode if fallback occurred */}
            {response?.fallback && presentationMode === 'live' && (
              <div className="mb-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-start gap-3 shadow-lg shadow-amber-500/5">
                <AlertOctagon className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-extrabold uppercase block mb-0.5 text-amber-400">⚠️ Offline Strategy Simulation Active</span>
                  The Gemini API Free Tier Quota was exhausted. The system gracefully degraded to an offline simulation generating premium match strategies dynamically! Paste your own Gemini API Key in the navbar override box above to restore direct live AI querying!
                </div>
              </div>
            )}
            <OutputTabs response={response} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Loading Overlay Spinner */}
      {loading && <Loader />}
    </div>
  );
}

/*
-------------------------------------------------------
HACKATHON LAUNCH INSTRUCTIONS
-------------------------------------------------------
To run this application locally, follow these commands in your Windows Powershell:

1. Open a new terminal in the 'frontend' directory:
   cd c:\Users\eakan\Desktop\APL\captain-cool\frontend

2. Install dependencies:
   npm install

3. Run Vite development server:
   npm run dev

4. Open your browser to the URL displayed (usually http://localhost:5173).
-------------------------------------------------------
*/
