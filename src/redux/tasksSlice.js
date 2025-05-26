
import { createSlice } from '@reduxjs/toolkit';

const loadTasks = () => {
  try {
    const stored = localStorage.getItem('tasks-redux');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: loadTasks()
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const updated = state.tasks.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      state.tasks = [...updated];
    },
    updateTaskStatus: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearAllTasks: (state) => {
      state.tasks = [];
    }
  }
});

export const {
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  clearAllTasks
} = tasksSlice.actions;

export default tasksSlice.reducer;
