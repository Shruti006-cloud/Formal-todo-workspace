import React from 'react';
import { BellRing, CheckCircle2, Clock, X } from 'lucide-react';
import { getPriorityBadgeStyles } from '../utils/helpers';

export default function AlarmModal({ task, onComplete, onSnooze, onDismiss }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border-2 border-[#991B1B] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Close / Dismiss button */}
        <button
          onClick={onDismiss}
          title="Dismiss alarm"
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ringing Icon Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#FEE2E2] text-[#991B1B] rounded-xl animate-bounce">
            <BellRing className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
              Task Deadline Alarm
            </span>
            <h2 className="text-lg font-bold text-[#0F172A]">Action Required</h2>
          </div>
        </div>

        {/* Task Details Box */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-6">
          <p className="text-base font-semibold text-[#0F172A] mb-2">{task.title}</p>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span
              className={`px-2 py-0.5 rounded border font-medium ${getPriorityBadgeStyles(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
            <span>• {task.category}</span>
            {task.dueTime && <span>• Due at {task.dueTime}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSnooze(task.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-xl transition-colors"
          >
            <Clock className="w-4 h-4" />
            Snooze 5m
          </button>

          <button
            onClick={() => onComplete(task.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Mark Done
          </button>
        </div>
      </div>
    </div>
  );
}