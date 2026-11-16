import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Calendar, Folder, Clock, AlertCircle } from 'lucide-react';
import { getPriorityBadgeStyles, formatDate } from '../utils/helpers';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEdit(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  const isOverdue = () => {
    if (task.completed || !task.dueDate) return false;
    const deadlineStr = task.dueTime
      ? `${task.dueDate}T${task.dueTime}`
      : `${task.dueDate}T23:59:59`;
    return new Date(deadlineStr) < new Date();
  };

  const overdue = isOverdue();

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white border rounded-xl transition-all ${
        task.completed
          ? 'border-slate-200 bg-slate-50/70'
          : overdue
          ? 'border-red-300 bg-red-50/30 shadow-sm'
          : 'border-[#E2E8F0] hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 px-2.5 py-1 text-sm border border-[#2563EB] rounded focus:outline-none"
                autoFocus
              />
              <button onClick={handleSave} className="p-1 text-emerald-700 hover:bg-emerald-50 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditedTitle(task.title);
                  setIsEditing(false);
                }}
                className="p-1 text-slate-500 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p
              className={`text-sm font-medium truncate ${
                task.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
              }`}
            >
              {task.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#64748B]">
            <span
              className={`px-2 py-0.5 rounded-md border font-medium ${getPriorityBadgeStyles(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {overdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-[#991B1B] font-semibold">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" />
              {task.category}
            </span>

            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.dueTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.dueTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 ml-3 opacity-80 group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            title="Edit task"
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 text-[#64748B] hover:text-[#991B1B] hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}