import React, { useState } from 'react';
import { Plus, Bell } from 'lucide-react';

export default function TaskForm({ onAddTask, notificationPermission, onRequestPermission }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      priority,
      dueDate,
      dueTime,
      notified: false,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setDueDate('');
    setDueTime('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          Create New Task
        </span>
        {notificationPermission !== 'granted' && (
          <button
            type="button"
            onClick={onRequestPermission}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            Enable Desktop Reminders
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4">
          <label className="block text-xs font-medium text-[#64748B] mb-1">Task Description</label>
          <input
            type="text"
            placeholder="e.g., Submit weekly status report..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#64748B] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white"
          >
            <option value="Work">Work</option>
            <option value="Development">Development</option>
            <option value="Planning">Planning</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#64748B] mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#64748B] mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white"
          />
        </div>

        <div className="md:col-span-2 flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#64748B] mb-1">Time</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-2.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-sm font-medium rounded-lg flex items-center gap-1 transition-colors h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </form>
  );
}