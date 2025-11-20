import React, { useState, useEffect } from 'react';
import CircularTimer from './CircularTimer';
import { SessionMode } from '../types';

interface SidebarProps {
  onModeChange: (mode: SessionMode) => void;
  currentMode: SessionMode;
  objective: string;
  setObjective: (obj: string) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onModeChange, 
  currentMode, 
  objective, 
  setObjective,
  onGeneratePlan,
  isGenerating
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(25 * 60);

  // Timer Logic
  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Audio cue could go here
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Mode switching
  const handleModeSelect = (mode: SessionMode) => {
    setIsActive(false);
    onModeChange(mode);
    let newTime = 25 * 60;
    switch (mode) {
      case SessionMode.POMODORO: newTime = 25 * 60; break;
      case SessionMode.DEEP_WORK: newTime = 50 * 60; break;
      case SessionMode.BREAK: newTime = 15 * 60; break;
    }
    setTotalTime(newTime);
    setTimeLeft(newTime);
  };

  const getModeColor = () => {
    if (currentMode === SessionMode.BREAK) return 'text-green-400';
    return 'text-purple-400';
  };

  return (
    <aside className="w-full md:w-[400px] flex-shrink-0 bg-[#121212] border-r border-gray-800 flex flex-col md:h-[calc(100vh-64px)] overflow-y-auto">
      {/* Top Section: Header */}
      <div className="p-8 pb-4">
        <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">
          Current Session
        </div>
        <h2 className={`text-3xl font-bold text-white mb-6 transition-colors duration-500 ${isActive ? 'opacity-100' : 'opacity-90'}`}>
          {currentMode}
        </h2>
        
        {/* Timer Display */}
        <div className="flex justify-center py-8">
          <CircularTimer 
            timeLeft={timeLeft} 
            totalTime={totalTime} 
            isActive={isActive}
            toggleTimer={() => setIsActive(!isActive)}
          />
        </div>

        {/* Mode Toggles */}
        <div className="flex justify-center gap-3 mt-6">
          {[
            { label: 'Pomodoro (25)', mode: SessionMode.POMODORO },
            { label: 'Deep (50)', mode: SessionMode.DEEP_WORK },
            { label: 'Break (15)', mode: SessionMode.BREAK }
          ].map((btn) => (
            <button
              key={btn.mode}
              onClick={() => handleModeSelect(btn.mode)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                currentMode === btn.mode 
                  ? 'bg-gray-800 text-white border border-gray-700' 
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-2"></div>

      {/* Bottom Section: Objective */}
      <div className="p-8 flex-1 flex flex-col">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Primary Objective
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative flex bg-[#1A1A1A] rounded-lg border border-gray-800 p-1">
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What is your main goal today?"
              className="w-full bg-transparent border-none text-gray-200 placeholder-gray-600 text-sm p-3 focus:ring-0 focus:outline-none"
            />
            <button 
              onClick={onGeneratePlan}
              disabled={isGenerating || !objective}
              className="px-3 text-purple-500 hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Generate Plan with AI"
            >
               {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          Define a clear goal to activate the flow state. Use the magic wand to let AI break it down for you.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;