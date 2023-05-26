import { createContext, useReducer } from 'react';

export const TasksContext = createContext();

export const tasksReducer = (state, action) => {
  const { data, taskId, subtaskId } = action.payload;
  switch (action.type) {
    case 'SET_TASKS':
      return {
        tasks: action.payload,
      };
    case 'CREATE_TASK':
      return {
        tasks: [action.payload, ...state.tasks],
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    case 'GET_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === taskId)
            return {
              ...task,
              subtasks: data,
            };
          else return task;
        }),
      };
    case 'CREATE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === taskId)
            return {
              ...task,
              subtasks: [data, ...task.subtasks],
            };
          else return task;
        }),
      };
    case 'UPDATE_SUBTASK':
      const updatedSubtask = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          return {
            ...task,
            subtasks: task.subtasks.map((taskSubtask) => {
              if (taskSubtask._id === updatedSubtask._id) return updatedSubtask;
              else return taskSubtask;
            }),
          };
        }),
      };
    case 'DELETE_SUBTASK':
      console.log(action.payload);
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === taskId)
            return {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask._id !== subtaskId),
            };
          else return task;
        }),
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask._id === subtaskId) {
                  return {
                    ...subtask,
                    messages: data,
                  };
                } else {
                  return subtask;
                }
              }),
            };
          } else {
            return task;
          }
        }),
      };
    case 'ADD_MESSAGE_TO_SUBTASK':
      const { user, messageContent } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask._id === subtaskId) {
                  return {
                    ...subtask,
                    messages: [
                      ...subtask.messages,
                      { sender: user.email, content: messageContent },
                    ],
                  };
                } else {
                  return subtask;
                }
              }),
            };
          } else {
            return task;
          }
        }),
      };
    default:
      return state;
  }
};

export const TasksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: null,
  });

  return <TasksContext.Provider value={{ ...state, dispatch }}>{children}</TasksContext.Provider>;
};
