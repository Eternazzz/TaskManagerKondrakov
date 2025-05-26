
export const TaskActionTypes = {
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  UPDATE_TASK_STATUS: 'UPDATE_TASK_STATUS',
  CLEAR_ALL_TASKS: 'CLEAR_ALL_TASKS'
};

export const addTask = ({ id, text, description, time, status = 'todo' }) => ({
  type: TaskActionTypes.ADD_TASK,
  payload: {
    id,
    text,
    description,
    time,
    status
  }
});

export const updateTask = (task) => ({
  type: TaskActionTypes.UPDATE_TASK,
  payload: task
});

export const deleteTask = (id) => ({
  type: TaskActionTypes.DELETE_TASK,
  payload: id
});

export const updateTaskStatus = (id, status) => ({
  type: TaskActionTypes.UPDATE_TASK_STATUS,
  payload: { id, status }
});

export const addTasksBulk = (tasks) => ({
  type: 'ADD_TASKS_BULK',
  payload: tasks
});
