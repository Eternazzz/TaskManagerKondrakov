import React, { useState, useEffect } from 'react';
import TaskInput from '../components/TaskInput';
import TaskBoard from '../components/TaskBoard';
import TaskAddDetailsModal from '../components/TaskAddDetailsModal';
import ExperimentModal from '../components/ExperimentModal';

export default function ContextTaskManager() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('tasks-context');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [pendingTaskName, setPendingTaskName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks-context', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = ({ id, text, description, time, auto = false, onComplete }) => {
    const task = { id, text, description, time, status: 'todo' };
    addTask(task);

    if (auto) {
      setTimeout(() => {
        updateTaskStatus(id, 'in progress');
         setTimeout(() => {
        updateTaskStatus(id, 'done');
        if (onComplete) onComplete();
      }, 3000);
      }, 2000);
     
    }

    setPendingTaskName(null);
  };

  const handleExperiment = (count) => {
    const startTime = Date.now();
    let completedCount = 0;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const baseTime = Date.now();
    for (let i = 0; i < count; i++) {
      const id = baseTime + i;
      handleAddTask({
        id,
        text: `Эксперимент Context #${i + 1}`,
        description: `Описание Context #${i + 1}`,
        time,
        auto: true,
        onComplete: () => {
          completedCount++;
          if (completedCount === count) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            setExecutionTime(`${duration} секунд`);
          }
        }
      });
    }
  };

  return (
    <>
      <TaskInput onRequestDetails={setPendingTaskName} />
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <button onClick={() => setShowModal(true)} style={{ marginRight: 10 }}>Эксперимент</button>
        <button
          onClick={() => {
            if (window.confirm('Удалить все задачи?')) {
              setTasks([]);
            }
          }}
          style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px' }}
        >
          Удалить все задачи
        </button>
      </div>

      {executionTime && (
        <div style={{ textAlign: 'right', marginBottom: 10, fontWeight: 'bold' }}>
          Время выполнения эксперимента: {executionTime}
        </div>
      )}

      <TaskBoard
        tasks={tasks}
        onStatusChange={updateTaskStatus}
        onDelete={deleteTask}
        onAddTask={(task) => {
          const id = Date.now() + Math.floor(Math.random() * 100000);
          handleAddTask({ ...task, id });
        }}
        onUpdateTask={updateTask}
      />

      {pendingTaskName && (
        <TaskAddDetailsModal
          taskName={pendingTaskName}
          onSave={({ text, description, time }) => {
            const id = Date.now() + Math.floor(Math.random() * 100000);
            handleAddTask({ id, text, description, time });
          }}
          onCancel={() => setPendingTaskName(null)}
        />
      )}

      {showModal && (
        <ExperimentModal
          onConfirm={(count) => {
            handleExperiment(count);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
