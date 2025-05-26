import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ReduxTaskManagerInner from './redux/ReduxTaskManager';
import ContextTaskManager from './context/ContextTaskManager';
import FluxTaskManager from './flux/FluxTaskManager';

export default function App() {
  const [mode, setMode] = useState('redux');
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now(), status: 'todo' }]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderManager = () => {
    const commonProps = {
      tasks,
      addTask,
      updateTaskStatus,
      deleteTask,
    };

    switch (mode) {
      case 'redux':
        return (
          <Provider store={store}>
            <ReduxTaskManagerInner sharedTasks={tasks} />
          </Provider>
        );
      case 'context':
        return <ContextTaskManager {...commonProps} />;
      case 'flux':
        return <FluxTaskManager {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <h1>Task Manager by Kondrakov</h1>
      <label>Выберите подход: </label>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="redux">Redux</option>
        <option value="context">Context API</option>
        <option value="flux">Flux</option>
      </select>
      <hr />
      {renderManager()}
    </div>
  );
}
