import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import AlarmModal from './components/AlarmModal';
import { AlertTriangle, Volume2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useLocalStorage('formal_todo_tasks_v1', []);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlarmTask, setActiveAlarmTask] = useState(null);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const audioCtxRef = useRef(null);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
    // Unlock audio context on user click
    playAlarmRing();
  };

  // Two-tone digital alarm ring (no MP3 file required)
  const playAlarmRing = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      // Play 3 rapid alarm pulses
      [0, 0.2, 0.4].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now + offset); // High A5 alert tone
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } catch (e) {
      console.warn('Audio blocked until user interacts with the page.');
    }
  };

  // Loop the alarm sound every 2.5 seconds while the pop-up modal is open
  useEffect(() => {
    if (!activeAlarmTask) return;
    playAlarmRing();
    const soundInterval = setInterval(playAlarmRing, 2500);
    return () => clearInterval(soundInterval);
  }, [activeAlarmTask]);

  // Check every 5 seconds for due tasks
  useEffect(() => {
    const checkReminders = () => {
      if (activeAlarmTask) return; // Don't overlap if an alarm is already ringing

      const now = new Date();
      let triggeredTask = null;

      const nextTasks = tasks.map((task) => {
        if (task.completed || task.notified || !task.dueDate || triggeredTask) return task;

        const targetTime = task.dueTime
          ? new Date(`${task.dueDate}T${task.dueTime}`)
          : new Date(`${task.dueDate}T09:00:00`);

        if (now >= targetTime) {
          triggeredTask = { ...task, notified: true };
          return triggeredTask;
        }
        return task;
      });

      if (triggeredTask) {
        setTasks(nextTasks);
        setActiveAlarmTask(triggeredTask);

        if (permission === 'granted') {
          new Notification('⏰ Task Alarm Ringing!', {
            body: `Action Required: "${triggeredTask.title}"`,
            requireInteraction: true,
          });
        }
      }
    };

    const interval = setInterval(checkReminders, 5000);
    return () => clearInterval(interval);
  }, [tasks, activeAlarmTask, permission, setTasks]);

  const addTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, updatedTitle) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: updatedTitle } : task))
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  // Alarm Modal Actions
  const handleAlarmComplete = (id) => {
    toggleTask(id);
    setActiveAlarmTask(null);
  };

  const handleAlarmSnooze = (id) => {
    const snoozeDate = new Date(Date.now() + 5 * 60000); // +5 minutes
    const yyyy = snoozeDate.getFullYear();
    const mm = String(snoozeDate.getMonth() + 1).padStart(2, '0');
    const dd = String(snoozeDate.getDate()).padStart(2, '0');
    const hh = String(snoozeDate.getHours()).padStart(2, '0');
    const min = String(snoozeDate.getMinutes()).padStart(2, '0');

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, dueDate: `${yyyy}-${mm}-${dd}`, dueTime: `${hh}:${min}`, notified: false }
          : t
      )
    );
    setActiveAlarmTask(null);
  };

  const overdueCount = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const deadline = t.dueTime ? `${t.dueDate}T${t.dueTime}` : `${t.dueDate}T23:59:59`;
      return new Date(deadline) < now;
    }).length;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && !task.completed) ||
        (statusFilter === 'Completed' && task.completed);

      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const hasCompletedTasks = tasks.some((t) => t.completed);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-12">
      <Header tasks={tasks} />

      {/* Full-Screen Pop-Up Alarm Modal */}
      <AlarmModal
        task={activeAlarmTask}
        onComplete={handleAlarmComplete}
        onSnooze={handleAlarmSnooze}
        onDismiss={() => setActiveAlarmTask(null)}
      />

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {overdueCount > 0 ? (
            <div className="flex-1 flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] px-4 py-3 rounded-xl text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                You have <strong>{overdueCount}</strong> overdue {overdueCount === 1 ? 'task' : 'tasks'}.
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Test Alarm Button so you can preview the pop-up & sound anytime */}
          <button
            type="button"
            onClick={() =>
              setActiveAlarmTask({
                id: 'demo-test',
                title: 'Sample Alarm Test — Submit Project Report',
                priority: 'High',
                category: 'Work',
                dueTime: 'Now',
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#0F172A] rounded-lg shadow-sm transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#2563EB]" />
            Test Pop-Up & Alarm
          </button>
        </div>

        <TaskForm
          onAddTask={addTask}
          notificationPermission={permission}
          onRequestPermission={requestNotificationPermission}
        />

        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />

        {hasCompletedTasks && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-xs font-medium text-[#64748B] hover:text-[#991B1B] transition-colors"
            >
              Clear completed tasks
            </button>
          </div>
        )}
      </main>
    </div>
  );
}