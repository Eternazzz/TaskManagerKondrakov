
import { EventEmitter } from 'events';

let _tasks = [];

try {
  const stored = localStorage.getItem('tasks-flux');
  _tasks = stored ? JSON.parse(stored) : [];
} catch {
  _tasks = [];
}

const TaskStore = Object.assign({}, EventEmitter.prototype, {
  getTasks() {
    return _tasks;
  },
  emitChange() {
    localStorage.setItem('tasks-flux', JSON.stringify(_tasks));
    TaskStore.emit('change');
  },
  addChangeListener(callback) {
    TaskStore.on('change', callback);
  },
  removeChangeListener(callback) {
    TaskStore.removeListener('change', callback);
  },
  _setTasks(newTasks) {
    _tasks = newTasks;
    TaskStore.emitChange();
  },
  _clearTasks() {
    _tasks = [];
    TaskStore.emitChange();
  }
});

export default TaskStore;


import Dispatcher from './Dispatcher';
import { TaskActionTypes } from './TaskActions';

Dispatcher.register(function (action) {
  switch (action.type) {
    case TaskActionTypes.ADD_TASK:
      TaskStore._setTasks([...TaskStore.getTasks(), action.payload]);
      break;

    case TaskActionTypes.UPDATE_TASK:
      TaskStore._setTasks(
        TaskStore.getTasks().map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      );
      break;

    case TaskActionTypes.UPDATE_TASK_STATUS:
      TaskStore._setTasks(
        TaskStore.getTasks().map(task =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        )
      );
      break;

    case TaskActionTypes.DELETE_TASK:
      TaskStore._setTasks(
        TaskStore.getTasks().filter(task => task.id !== action.payload)
      );
      break;

    case TaskActionTypes.CLEAR_ALL_TASKS:
      TaskStore._clearTasks();
      break;

    default:
      break;
  }
});
