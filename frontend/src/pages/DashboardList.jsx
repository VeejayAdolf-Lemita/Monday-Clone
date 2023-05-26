import React from 'react';
import axios from 'axios';
import SideNav from '../components/Sidenav';
import DashboardNav from '../components/DashboardNav';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import TasksDetails from '../components/TasksDetails';
import { useAuthContext } from '../hooks/useAuthContext';

const DashboardList = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        dispatch({ type: 'SET_TASKS', payload: response.data });
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);

  return (
    <>
      <DashboardNav />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <div className='home'>
          <div className='tasks'>
            {tasks &&
              tasks.map((task) => (
                <TasksDetails key={task?._id} task={task} subtasks={task?.subtasks} />
              ))}
          </div>
        </div>
      </Box>
    </>
  );
};

export default DashboardList;
