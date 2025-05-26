
import React, { useState, useEffect } from 'react';
import TaskInput from '../components/TaskInput';
import TaskBoard from '../components/TaskBoard';
import TaskAddDetailsModal from '../components/TaskAddDetailsModal';
import ExperimentModal from '../components/ExperimentModal';
import Dispatcher from './Dispatcher';
import TaskStore from './TaskStore';
import { addTask, updateTask, updateTaskStatus, deleteTask } from './TaskActions';

export default function FluxTaskManager() {
  const [tasks, setTasks] = useState(TaskStore.getTasks());
  const [pendingTaskName, setPendingTaskName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  useEffect(() => {
    const onChange = () => setTasks(TaskStore.getTasks());
    TaskStore.addChangeListener(onChange);
    return () => TaskStore.removeChangeListener(onChange);
  }, []);

  const handleAddTask = ({ id, text, description, time, auto = false, onComplete }) => {
    Dispatcher.dispatch(addTask({ id, text, description, time, status: 'todo' }));
    setPendingTaskName(null);

    if (auto) setTimeout(() => {
      Dispatcher.dispatch(updateTaskStatus(id, 'in progress'));
      Dispatcher.dispatch(updateTask({ id, text, time, status: 'in progress', description: `description1 #${text.match(/\d+/)?.[0]}` }));
      if (auto) setTimeout(() => {
      Dispatcher.dispatch(updateTaskStatus(id, 'done'));
      if (onComplete) onComplete();
    }, 3000);
    }, 2000);
  
  };

  const handleExperiment = (count) => {
    const startTime = Date.now();
    let completedCount = 0;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const baseTime = Date.now();
    for (let i = 0; i < count; i++) {
      const id = baseTime + i;
      handleAddTask({ id,
        onComplete: () => {
          completedCount++;
          if (completedCount === count) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            setExecutionTime(`${duration} секунд`);
          }
        },
        text: `Эксперимент Flux #${i + 1}`,
        auto: true,
        description: `Описание Flux #${i + 1}`,
        time
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
      Dispatcher.dispatch({ type: 'CLEAR_ALL_TASKS' });
    }
  }}
  style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px' }}
>
  Удалить все задачи
</button>
      </div>
      {executionTime && (
        <div style={{ textAlign: 'right', marginTop: 10,marginBottom:10, fontWeight: 'bold' }}>
          Время выполнения эксперимента: {executionTime}
        </div>
      )}
      <TaskBoard
        tasks={tasks}
        onStatusChange={(id, status) => Dispatcher.dispatch(updateTaskStatus(id, status))}
        onDelete={(id) => Dispatcher.dispatch(deleteTask(id))}
        onAddTask={(task) => {
          const id = Date.now() + Math.floor(Math.random() * 100000);
      handleAddTask({ id,
        onComplete: () => {
          completedCount++;
          if (completedCount === count) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            setExecutionTime(`${duration} секунд`);
          }
        }, ...task });
        }}
        onUpdateTask={(task) => Dispatcher.dispatch(updateTask(task))}
      />
      {pendingTaskName && (
        <TaskAddDetailsModal
          taskName={pendingTaskName}
          onSave={({ text, description, time }) => {
            const id = Date.now() + Math.floor(Math.random() * 100000);
      handleAddTask({ id,
        onComplete: () => {
          completedCount++;
          if (completedCount === count) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            setExecutionTime(`${duration} секунд`);
          }
        }, text, description, time });
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
