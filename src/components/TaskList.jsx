import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList } from 'lucide-react';

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-dashed border-[#CBD5E1] rounded-xl p-12 text-center">
        <ClipboardList className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
        <h3 className="text-sm font-medium text-[#0F172A]">No tasks found</h3>
        <p className="text-xs text-[#64748B] mt-1">
          Add a new task above or adjust your active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}