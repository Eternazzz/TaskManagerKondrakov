import React, { useState } from 'react';
import TaskDetailsModal from './TaskDetailsModal';
import TaskAddDetailsModal from './TaskAddDetailsModal';
import TaskEditModal from './TaskEditModal';

export default function TaskBoard({ tasks, onStatusChange, onDelete, onAddTask, onUpdateTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [addingTaskName, setAddingTaskName] = useState(null);
  const [sortOption, setSortOption] = useState('created');

  const rowStatuses = ['todo', 'in progress', 'done'];
  const columnStatuses = ['pending'];

  const statusStyles = {
    todo: { backgroundColor: '#e0e0e0', color: '#333' },
    'in progress': { backgroundColor: '#ffe5b4', color: '#b35900' },
    pending: { backgroundColor: '#d8b4fe', color: '#6b21a8' },
    done: { backgroundColor: '#d4edda', color: '#155724' },
  };

  const isValidTransition = (from, to) => {
    if (from === to) return true;
    if (from === 'todo') return to === 'in progress' || to === 'pending';
    if (from === 'in progress') return to === 'pending' || to === 'done';
    if (from === 'pending') return to === 'in progress' || to === 'todo';
    if (from === 'done') return false;
    return true;
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData('taskId'));
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const oldStatus = task.status;
    if (!isValidTransition(oldStatus, newStatus)) {
      alert(`Переход из "${oldStatus}" в "${newStatus}" не допускается.`);
      return;
    }
    onStatusChange(taskId, newStatus);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSaveEdit = (updatedTask) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const sortTasks = (taskList) => {
    const sorted = [...taskList];
    if (sortOption === 'created') {
      return sorted.sort((a, b) => b.id - a.id);
    } else if (sortOption === 'duration-asc') {
      return sorted.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    } else if (sortOption === 'duration-desc') {
      return sorted.sort((a, b) => parseTime(b.time) - parseTime(a.time));
    }
    return sorted;
  };

  const renderTask = (task, status) => {
    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        style={{
          padding: 8,
          marginBottom: 6,
          border: '1px solid #ddd',
          borderRadius: 3,
          cursor: 'grab',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: statusStyles[task.status]?.backgroundColor,
          color: statusStyles[task.status]?.color,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              marginRight: 8,
              fontWeight: 'bold',
            }}
            onClick={() => setSelectedTask(task)}
          >
            {task.text}
          </span>
          <div style={{ flexShrink: 0 }}>
            <button onClick={() => setSelectedTask(task)} title="Просмотр">👁️</button>
            <button onClick={() => setEditingTask(task)} title="Редактировать">✎</button>
            {status === 'done' && (
              <button onClick={() => onDelete(task.id)} title="Удалить">✖</button>
            )}
          </div>
        </div>
        {task.time && (
          <small style={{ marginTop: 4 }}>⏱ {task.time}</small>
        )}
      </div>
    );
  };

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <label>Сортировать по: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="created">Времени создания (новые сверху)</option>
          <option value="duration-asc">Времени выполнения (по возрастанию)</option>
          <option value="duration-desc">Времени выполнения (по убыванию)</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {rowStatuses.map((status) => (
            <div
              key={status}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
              style={{
                width: 370,
                flex: 'none',
                minHeight: 200,
                border: '1px solid #ccc',
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ textTransform: 'capitalize', display: 'flex', justifyContent: 'center' }}>
                {status}
              </h3>
              {sortTasks(tasks.filter((t) => t.status === status)).map((task) => renderTask(task, status))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {columnStatuses.map((status) => (
            <div
              key={status}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
              style={{
                width: 370,
                flex: 'none',
                minHeight: 200,
                border: '1px solid #ccc',
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ textTransform: 'capitalize', display: 'flex', justifyContent: 'center' }}>
                {status}
              </h3>
              {sortTasks(tasks.filter((t) => t.status === status)).map((task) => renderTask(task, status))}
            </div>
          ))}
        </div>
      </div>

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      {addingTaskName && (
        <TaskAddDetailsModal
          taskName={addingTaskName}
          onSave={(task) => {
            onAddTask(task);
            setAddingTaskName(null);
          }}
          onCancel={() => setAddingTaskName(null)}
        />
      )}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveEdit}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
