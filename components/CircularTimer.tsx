import React from 'react';

interface CircularTimerProps {
  timeLeft: number; // in seconds
  totalTime: number; // in seconds (current session duration)
  isActive: boolean;
  toggleTimer: () => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ timeLeft, totalTime, isActive, toggleTimer }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // The timer's visual "fullness" is relative to the max Deep Work session (50 mins)
  // 50 mins = 3000 seconds.
  // If we select Pomodoro (25m), it should visually fill 50% of the circle.
  const MAX_TIME = 50 * 60; 
  
  // Ensure we don't exceed 100% if something goes wrong, though timeLeft shouldn't exceed MAX_TIME
  const progress = Math.min(timeLeft / MAX_TIME, 1);
  const dashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Ring (faint track) */}
      <div className="absolute inset-0 rounded-full border-4 border-purple-900/20"></div>
      
      {/* SVG Ring */}
      <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
        <circle
          cx="50%"
          cy="50%"
          r={radius + "%"}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-purple-600 transition-all duration-1000 ease-linear"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashoffset,
            strokeLinecap: "round"
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className="text-5xl font-bold tracking-widest text-white font-mono mb-4">
          {formatTime(timeLeft)}
        </span>
        <button
          onClick={toggleTimer}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
          }`}
        >
          <i className={`fas ${isActive ? 'fa-pause' : 'fa-play'} text-lg`}></i>
        </button>
      </div>
    </div>
  );
};

export default CircularTimer;