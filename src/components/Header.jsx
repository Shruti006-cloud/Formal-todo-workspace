import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function Header({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-[#1E293B] text-white border-b border-slate-700 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2563EB] rounded-lg">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Task Management Workspace</h1>
            <p className="text-xs text-slate-300 mt-0.5">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-[#0F172A]/60 px-4 py-2.5 rounded-lg border border-slate-700/80 text-sm">
          <div>
            <span className="text-slate-400 block text-xs">Total</span>
            <span className="font-semibold text-white">{totalTasks}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-xs">Pending</span>
            <span className="font-semibold text-amber-400">{pendingTasks}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-xs">Completed</span>
            <span className="font-semibold text-emerald-400">{completedTasks}</span>
          </div>
        </div>
      </div>
    </header>
  );
}