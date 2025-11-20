import React from 'react';

interface HeaderProps {
  xp: number;
  zenMode: boolean;
  toggleZenMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ xp, zenMode, toggleZenMode }) => {
  return (
    <header className="w-full h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
          <i className="fas fa-terminal text-white text-sm"></i>
        </div>
        <h1 className="text-xl font-bold text-gray-100 tracking-tight">
          DevMastery<span className="text-purple-500">.OS</span>
        </h1>
        <span className="hidden md:block text-xs text-gray-500 ml-2 border-l border-gray-700 pl-3">
          Remote Focus & Growth Engine
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 flex items-center gap-2">
          <i className="fas fa-bolt text-yellow-400 text-xs"></i>
          <span className="text-sm font-semibold text-gray-200">{xp} XP</span>
        </div>

        <button 
          onClick={toggleZenMode}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${zenMode ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
        >
          <i className="fas fa-om"></i>
          <span className="hidden sm:inline">Zen Mode</span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 cursor-pointer">
           <i className="fas fa-user text-xs"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
