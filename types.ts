export enum SessionMode {
  POMODORO = 'Pomodoro',
  DEEP_WORK = 'Deep Work',
  BREAK = 'Break'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  tabId: string;
}

export interface TabData {
  id: string;
  label: string;
  icon: string;
  contentTitle: string;
  contentDescription: string;
}

export interface DailyPlanResponse {
  tasks: Array<{
    title: string;
    description: string;
    xp: number;
  }>;
}