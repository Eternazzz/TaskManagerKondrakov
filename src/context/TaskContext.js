import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

let nextId = 1;

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    setTasks((prev) => [...prev, { id: nextId++, text, status: 'todo' }]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}