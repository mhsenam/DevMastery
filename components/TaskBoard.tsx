import React, { useState } from 'react';
import { Task, TabData } from '../types';

interface TaskBoardProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tasks: Task[];
  toggleTask: (id: string) => void;
  tabs: TabData[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ activeTab, setActiveTab, tasks, toggleTask, tabs }) => {
  
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <main className="flex-1 flex flex-col bg-[#0a0a0a] h-full overflow-hidden relative">
      
      {/* Tab Navigation - 3 Equal Columns */}
      <div className="grid grid-cols-3 border-b border-gray-800 bg-[#0a0a0a] z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 py-5 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-purple-500 text-white bg-gray-900/30'
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900/10'
            }`}
          >
            <i className={`${tab.icon} ${activeTab === tab.id ? 'text-purple-400' : ''} text-lg md:text-base`}></i>
            <span className="hidden md:inline truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          
          {/* Hero Text for Tab */}
          <div className="mb-10 relative">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{currentTab.contentTitle}</h2>
              <div className="text-xs text-gray-600 flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors mt-2 md:mt-0">
                <i className="fas fa-eye"></i> <span className="hidden sm:inline">Visibility Tool</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-2xl">
              {currentTab.contentDescription}
            </p>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  task.completed 
                    ? 'bg-gray-900/30 border-gray-800' 
                    : 'bg-[#151515] border-gray-800 hover:border-gray-700 hover:bg-[#1A1A1A]'
                }`}
              >
                 {/* Selection Indicator Line */}
                 <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${task.completed ? 'bg-purple-600' : 'bg-purple-600/0 group-hover:bg-purple-600'}`}></div>

                 <div className="flex items-start gap-4 pl-2">
                    {/* Custom Checkbox */}
                    <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      task.completed 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                        : 'bg-[#0a0a0a] border border-gray-600 group-hover:border-purple-500'
                    }`}>
                      {task.completed && <i className="fas fa-check text-xs"></i>}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold text-base mb-1 transition-colors ${task.completed ? 'text-gray-400' : 'text-gray-200'}`}>
                          {task.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {task.description}
                      </p>
                      
                      {/* XP Badge - Always visible now */}
                      <div className={`mt-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border transition-opacity ${
                        task.completed 
                          ? 'bg-purple-900/20 text-purple-500 border-purple-900/30 opacity-70' 
                          : 'bg-purple-900/30 text-purple-400 border-purple-900/50'
                      }`}>
                        +{task.xp} XP
                      </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Empty State if no tasks */}
          {tasks.length === 0 && (
             <div className="text-center py-20 opacity-50">
                <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                  <i className="fas fa-robot text-purple-500 text-2xl"></i>
                </div>
                <p className="text-gray-500 text-sm">No tasks in this module yet.<br/>Use the sidebar AI to generate a plan.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TaskBoard;