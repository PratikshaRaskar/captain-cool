import React from 'react';
import BowlerManager from './BowlerManager';
import { Send, Sparkles } from 'lucide-react';

export default function MatchForm({
  matchState,
  setMatchState,
  bowlers,
  setBowlers,
  onSubmit,
  onLoadPreset
}) {
  const handleChange = (field, value) => {
    setMatchState({
      ...matchState,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!matchState.batting_team || !matchState.bowling_team || !matchState.striker) {
      alert("Please fill in key match details (Batting Team, Bowling Team, and Striker)!");
      return;
    }
    onSubmit();
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col gap-5">
      {/* Preset Match state Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Live Match Parameters
        </h3>
        <button
          type="button"
          onClick={onLoadPreset}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-accentPurple/25 hover:bg-accentPurple/45 text-purple-300 border border-accentPurple/30 hover:border-accentPurple/50 shadow-glowPurple transition-all active:scale-95 duration-200"
        >
          Load Demo Chase 🏏
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Teams Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Batting Side
            </label>
            <input
              type="text"
              value={matchState.batting_team}
              onChange={(e) => handleChange('batting_team', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Bowling Side
            </label>
            <input
              type="text"
              value={matchState.bowling_team}
              onChange={(e) => handleChange('bowling_team', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Batsmen Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Striker
            </label>
            <input
              type="text"
              value={matchState.striker}
              onChange={(e) => handleChange('striker', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Non-Striker
            </label>
            <input
              type="text"
              value={matchState.non_striker}
              onChange={(e) => handleChange('non_striker', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Score & Wickets */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Innings
            </label>
            <select
              value={matchState.innings}
              onChange={(e) => handleChange('innings', parseInt(e.target.value))}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value={1}>1st Innings</option>
              <option value={2}>2nd Innings</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Over
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={matchState.over}
              onChange={(e) => handleChange('over', parseFloat(e.target.value) || 0)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Wickets
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={matchState.wickets}
              onChange={(e) => handleChange('wickets', parseInt(e.target.value) || 0)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Score & Target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Runs Scored
            </label>
            <input
              type="number"
              min="0"
              value={matchState.score}
              onChange={(e) => handleChange('score', parseInt(e.target.value) || 0)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          {matchState.innings === 2 && (
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Target Score
              </label>
              <input
                type="number"
                min="0"
                value={matchState.target}
                onChange={(e) => handleChange('target', parseInt(e.target.value) || 0)}
                className="w-full text-xs bg-slate-950/80 border border-cyan-500/30 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 shadow-glowCyan/20 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Pitch & Dew */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Pitch Type
            </label>
            <select
              value={matchState.pitch}
              onChange={(e) => handleChange('pitch', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="flat">Flat Track</option>
              <option value="turning">Turning Pitch</option>
              <option value="two-paced">Two-Paced / Slow</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Dew Factor
            </label>
            <select
              value={matchState.dew}
              onChange={(e) => handleChange('dew', e.target.value)}
              className="w-full text-xs bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="low">Low / Negligible</option>
              <option value="medium">Medium</option>
              <option value="high">High Dew</option>
            </select>
          </div>
        </div>

        {/* Switches Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-white/5">
          {/* Powerplay */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/30 border border-white/5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Powerplay
            </span>
            <button
              type="button"
              onClick={() => handleChange('powerplay', !matchState.powerplay)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${matchState.powerplay ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-950 border border-white/10'}`}
            >
              <span className={`w-3.5 h-3.5 rounded-full bg-gray-400 transition-transform duration-300 ${matchState.powerplay ? 'translate-x-5 bg-cyan-400 shadow-glowCyan' : ''}`}></span>
            </button>
          </div>

          {/* Death Overs */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/30 border border-white/5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Death Overs
            </span>
            <button
              type="button"
              onClick={() => handleChange('death_overs', !matchState.death_overs)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${matchState.death_overs ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-950 border border-white/10'}`}
            >
              <span className={`w-3.5 h-3.5 rounded-full bg-gray-400 transition-transform duration-300 ${matchState.death_overs ? 'translate-x-5 bg-cyan-400 shadow-glowCyan' : ''}`}></span>
            </button>
          </div>

          {/* Impact Player */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/30 border border-white/5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Impact Player
            </span>
            <button
              type="button"
              onClick={() => handleChange('impact_player_available', !matchState.impact_player_available)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${matchState.impact_player_available ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-950 border border-white/10'}`}
            >
              <span className={`w-3.5 h-3.5 rounded-full bg-gray-400 transition-transform duration-300 ${matchState.impact_player_available ? 'translate-x-5 bg-cyan-400 shadow-glowCyan' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Bowler Manager Wrapper */}
        <BowlerManager bowlers={bowlers} setBowlers={setBowlers} />

        {/* CTA Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 hover:from-cyan-400 hover:via-teal-300 hover:to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-widest shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-[0.98] transition-all duration-300"
        >
          <Send className="w-4 h-4 fill-current" />
          Get Captain’s Call
        </button>
      </form>
    </div>
  );
}
