
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask, clearAllTasks } from './tasksSlice';
import TaskInput from '../components/TaskInput';
import TaskBoard from '../components/TaskBoard';
import TaskAddDetailsModal from '../components/TaskAddDetailsModal';
import ExperimentModal from '../components/ExperimentModal';

export default function ReduxTaskManagerInner() {
  

const tasks = useSelector((state) => state.tasks.tasks);
  useEffect(() => {
    localStorage.setItem('tasks-redux', JSON.stringify(tasks));
  }, [tasks]);
  const dispatch = useDispatch();
  
  const [pendingTaskName, setPendingTaskName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const handleAddTask = ({ id = Date.now() + Math.floor(Math.random() * 100000), text, description, time, auto = false, onComplete }) => {
    const baseTask = { id, text, description, time, status: 'todo' };
    dispatch(addTask(baseTask));
    setPendingTaskName(null);

    if (auto) {
      setTimeout(() => {
        dispatch(updateTask({
          ...baseTask,
          status: 'in progress',
          description: `description1 #${text.match(/\d+/)?.[0] || ''}`
        }));
              setTimeout(() => {
        dispatch(updateTask({
          ...baseTask,
          status: 'done',
          description: `description1 #${text.match(/\d+/)?.[0] || ''}`
        }));
        if (onComplete) onComplete();
      }, 3000);
      }, 2000);


    }
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
        onComplete: () => {
          completedCount++;
          if (completedCount === count) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            setExecutionTime(`${duration} секунд`);
          }
        },
        text: `Эксперимент Redux #${i + 1}`,
        description: `Описание Redux #${i + 1}`,
        time,
        auto: true
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
            dispatch(clearAllTasks());
            }
          }}
          style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px' }}>
          Удалить все задачи
</button>
      </div>
      {executionTime && (
        <div style={{ textAlign: 'right', marginTop: 10,marginBottom:10, fontWeight: 'bold' }}>
          Время выполнения эксперимента: {executionTime}
        </div>
      )}
      <TaskBoard
        key={JSON.stringify(tasks)}
        tasks={tasks}
        onStatusChange={(id, status) => {
          const task = tasks.find(t => t.id === id);
          if (task) dispatch(updateTask({ ...task, status }));
        }}
        onDelete={(id) => dispatch(deleteTask(id))}
        onAddTask={handleAddTask}
        onUpdateTask={(task) => dispatch(updateTask(task))}
      />
      {pendingTaskName && (
        <TaskAddDetailsModal
          taskName={pendingTaskName}
          onSave={({ text, description, time }) => {
            handleAddTask({
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
