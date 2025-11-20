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
              <div className="text-xs text-gray-600 flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors">
                <i className="fas fa-bullhorn"></i> <span className="hidden sm:inline">Visibility Tool</span>
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
                    ? 'bg-gray-900/20 border-gray-800 opacity-60' 
                    : 'bg-[#151515] border-gray-800 hover:border-gray-700 hover:bg-[#1A1A1A]'
                }`}
              >
                 {/* Selection Indicator Line */}
                 <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${task.completed ? 'bg-green-500' : 'bg-purple-600 group-hover:bg-purple-500'}`}></div>

                 <div className="flex items-start gap-4 pl-2">
                    {/* Custom Checkbox */}
                    <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed 
                        ? 'bg-green-500/20 border-green-500 text-green-500' 
                        : 'bg-gray-900 border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {task.completed && <i className="fas fa-check text-xs"></i>}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold text-base mb-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {task.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {task.description}
                      </p>
                      
                      {/* XP Badge */}
                      {!task.completed && (
                        <div className="mt-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/30 text-purple-400 border border-purple-900/50">
                          +{task.xp} XP
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Empty State if no tasks */}
          {tasks.length === 0 && (
             <div className="text-center py-20">
                <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                  <i className="fas fa-rocket text-purple-500 text-2xl"></i>
                </div>
                <p className="text-gray-500">No tasks yet. Use the AI generator in the sidebar!</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TaskBoard;