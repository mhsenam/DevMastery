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
    contentTitle: 'Code for Humans, Not Machines',
    contentDescription: '"Clean code is about empathy." Junior devs write code that works. Senior devs write code that others can maintain, debug, and extend 6 months from now.'
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
    title: 'Names That Tell Stories',
    description: "Avoid `data`, `item`, `handle`. Use `userProfile`, `cartItem`, `submitCheckoutForm`. If you need a comment to explain the variable name, rename the variable.",
    xp: 20,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c2',
    title: 'Guard Clauses Over Nesting',
    description: "Don't nest `if` statements 3 levels deep. Check for failure conditions early and `return`. Keep the 'happy path' at the root indentation level.",
    xp: 25,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c3',
    title: 'Accessibility Is Not Optional',
    description: "Use semantic HTML (`<button>` not `div`). Ensure keyboard navigability. A 1% developer cares about ALL users.",
    xp: 30,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c4',
    title: 'Self-Documenting Functions',
    description: "A function should do ONE thing. If `processUser` validates, saves, and emails, break it into `validateUser`, `saveUser`, `emailUser`.",
    xp: 20,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c5',
    title: 'Console Hygiene',
    description: "Remove your `console.log('here')` before committing. Use `console.error` for catches. Don't ship noise.",
    xp: 10,
    completed: false,
    tabId: 'code'
  },
  {
    id: 'c6',
    title: 'Component Composition',
    description: "Avoid massive 'God Components'. Break UI into small, reusable pieces. Use slots or children props for flexibility.",
    xp: 25,
    completed: false,
    tabId: 'code'
  },
  // System Design Tasks
  {
    id: 's1',
    title: 'CAP Theorem Analysis',
    description: "Analyze your current project's database. Is it CP or AP? Document why that trade-off was made in your engineering notes.",
    xp: 40,
    completed: false,
    tabId: 'system'
  },
  {
    id: 's2',
    title: 'Design Idempotency Keys',
    description: "Draft a plan to make your critical POST endpoints idempotent using request IDs to prevent duplicate processing on network retries.",
    xp: 35,
    completed: false,
    tabId: 'system'
  },
  {
    id: 's3',
    title: 'Load Balancer Strategy',
    description: "Review your load balancing strategy (Round Robin, Least Connections, etc.). Determine if 'Sticky Sessions' are creating hot spots.",
    xp: 30,
    completed: false,
    tabId: 'system'
  },
  {
    id: 's4',
    title: 'Database Indexing Plan',
    description: "Identify slow queries in your logs. Propose specific compound indexes to optimize them without over-indexing write-heavy tables.",
    xp: 45,
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
    // 1. Find the task to determine current state
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const isNowCompleted = !task.completed;

    // 2. Update XP immediately based on the toggle action
    if (isNowCompleted) {
      setXp(prev => prev + task.xp);
    } else {
      setXp(prev => Math.max(0, prev - task.xp));
    }

    // 3. Update Task state
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: isNowCompleted } : t
    ));
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
        tabId: activeTab // Crucial: Add generated tasks to the currently Active Tab
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