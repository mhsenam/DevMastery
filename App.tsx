import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskBoard from './components/TaskBoard';
import { Task, SessionMode, TabData } from './types';
import { generateSmartPlan } from './services/geminiService';

// Initial Data
const INITIAL_TABS: TabData[] = [
  {
    id: 'mindset',
    label: 'The 1% Mindset',
    icon: 'fas fa-brain',
    contentTitle: 'Why Remote Devs Fail (Or Scale)',
    contentDescription: 'In an office, people see you working. Remote, you are invisible until you ship or speak. To be the "best," you must manufacture visibility and trust through reliability and over-communication.'
  },
  {
    id: 'code',
    label: 'Clean Code 2025',
    icon: 'fas fa-code',
    contentTitle: 'Modern Clean Code Practices',
    contentDescription: 'Code is read far more often than it is written. Optimization for readability is optimization for maintainability.'
  },
  {
    id: 'system',
    label: 'System Design',
    icon: 'fas fa-network-wired',
    contentTitle: 'Scalable Architecture Patterns',
    contentDescription: 'Designing systems that are resilient, scalable, and maintainable requires understanding trade-offs between consistency, availability, and partition tolerance.'
  }
];

const INITIAL_TASKS: Task[] = [
  // Mindset Tasks
  {
    id: 'm1',
    title: 'Over-communicate Intent',
    description: "Don't disappear. If you're stepping away for 30 mins, say so. If you're stuck for >45 mins, post a public question. Silence creates anxiety in remote managers.",
    xp: 20,
    completed: false,
    tabId: 'mindset'
  },
  {
    id: 'm2',
    title: 'The "Eat The Frog" Start',
    description: "Do the hardest, most cognitively demanding task FIRST thing in the morning. Don't check Slack/Email until you've done 1 hour of deep work.",
    xp: 30,
    completed: false,
    tabId: 'mindset'
  },
  {
    id: 'm3',
    title: 'Proactive Jira Updates',
    description: "Update your tickets before someone asks you to. Your ticket status is your heartbeat to the rest of the organization.",
    xp: 15,
    completed: false,
    tabId: 'mindset'
  },
  // Clean Code Tasks
  {
    id: 'c1',
    title: 'Function Purity Audit',
    description: "Review your last PR. Identify any side effects in your utility functions. Refactor to make them pure (deterministic output for same input).",
    xp: 25,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c2',
    title: 'Implement Early Returns',
    description: "Scan for nested if/else blocks. Refactor using guard clauses and early returns to reduce cognitive load and indentation depth.",
    xp: 20,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c3',
    title: 'Semantic Naming Review',
    description: "Rename 3 variables or functions that use generic names (e.g., 'data', 'handler') to something that explicitly describes their intent.",
    xp: 15,
    completed: false,
    tabId: 'code'
  },
  // System Design Tasks
  {
    id: 's1',
    title: 'Define API Contracts',
    description: "Draft the OpenAPI/Swagger spec for a new endpoint before writing a single line of code. Ensure status codes and error payloads are standardized.",
    xp: 35,
    completed: false,
    tabId: 'system'
  },
  {
    id: 's2',
    title: 'Database Index Optimization',
    description: "Analyze slow query logs. Identify a query performing a full table scan and propose a compound index to optimize it.",
    xp: 40,
    completed: false,
    tabId: 'system'
  },
  {
    id: 's3',
    title: 'Draw C4 Model Diagram',
    description: "Create a Context or Container diagram for your current service to visualize dependencies and data flow.",
    xp: 30,
    completed: false,
    tabId: 'system'
  }
];

const App: React.FC = () => {
  const [xp, setXp] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const [currentMode, setCurrentMode] = useState<SessionMode>(SessionMode.DEEP_WORK);
  const [activeTab, setActiveTab] = useState('mindset');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [objective, setObjective] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isNowCompleted = !task.completed;
        
        // XP Logic: Add if completed, Subtract if unchecked
        if (isNowCompleted) {
          setXp(x => x + task.xp);
        } else {
          setXp(x => Math.max(0, x - task.xp));
        }

        return { ...task, completed: isNowCompleted };
      }
      return task;
    }));
  };

  const handleGeneratePlan = async () => {
    if (!objective) return;
    setIsGenerating(true);
    
    const response = await generateSmartPlan(objective);
    
    if (response.tasks.length > 0) {
      const newTasks: Task[] = response.tasks.map((t, i) => ({
        id: `gen-${Date.now()}-${i}`,
        title: t.title,
        description: t.description,
        xp: t.xp,
        completed: false,
        tabId: activeTab // Add to current tab
      }));
      setTasks(prev => [...prev, ...newTasks]);
    }
    
    setIsGenerating(false);
  };

  // Filter tasks for the current view
  const visibleTasks = tasks.filter(t => t.tabId === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-200 font-sans overflow-hidden">
      {!zenMode && (
        <Header xp={xp} zenMode={zenMode} toggleZenMode={() => setZenMode(!zenMode)} />
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - collapsible in Zen Mode */}
        <div className={`transition-all duration-300 ${zenMode ? 'md:-ml-[400px] opacity-50 hover:opacity-100 hover:ml-0 z-50 absolute md:static h-full' : 'relative'}`}>
           <Sidebar 
             currentMode={currentMode} 
             onModeChange={setCurrentMode} 
             objective={objective}
             setObjective={setObjective}
             onGeneratePlan={handleGeneratePlan}
             isGenerating={isGenerating}
           />
        </div>
        
        {/* Main Content */}
        <TaskBoard 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tasks={visibleTasks} 
          toggleTask={toggleTask}
          tabs={INITIAL_TABS}
        />
      </div>

      {/* Zen Mode Floating Toggle (visible only when Zen Mode is active) */}
      {zenMode && (
        <button 
          onClick={() => setZenMode(false)}
          className="fixed top-4 right-4 z-50 bg-gray-900/80 backdrop-blur text-gray-400 hover:text-white p-2 rounded-full border border-gray-700 transition-colors"
        >
          <i className="fas fa-compress-arrows-alt"></i>
        </button>
      )}
    </div>
  );
};

export default App;