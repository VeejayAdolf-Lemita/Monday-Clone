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
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'GET_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === taskId)
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
          if (task.id === taskId)
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
              if (taskSubtask.id === updatedSubtask.id) return updatedSubtask;
              else return taskSubtask;
            }),
          };
        }),
      };
    case 'DELETE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === taskId)
            return {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
            };
          else return task;
        }),
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            // Use action.payload.taskId instead of taskId
            const updatedSubtasks = task.subtasks.map((subtask) => {
              if (subtask.id === action.payload.subtaskId) {
                // Use action.payload.subtaskId instead of subtaskId
                return {
                  ...subtask,
                  messages: subtask.messages.map((message) => {
                    if (message._id === action.payload.messageId) {
                      // Use action.payload.messageId to find the correct message
                      return {
                        ...message,
                        replies: action.payload.data.replies, // Update the replies for the message
                      };
                    } else {
                      return message;
                    }
                  }),
                };
              } else {
                return subtask;
              }
            });

            return {
              ...task,
              subtasks: updatedSubtasks,
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
          return {
            ...task,
            subtasks: task.subtasks.map((subtask) => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  messages: [...subtask.messages, { sender: user?.email, content: messageContent }],
                };
              }
              return subtask;
            }),
          };
        }),
      };
    default:
      return state;
  }
};

export const TasksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [],
    isLoading: false,
  });

  return <TasksContext.Provider value={{ ...state, dispatch }}>{children}</TasksContext.Provider>;
};
