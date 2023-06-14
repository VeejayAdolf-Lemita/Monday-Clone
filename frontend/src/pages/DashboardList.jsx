import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideNav from '../components/Sidenav';
import DashboardNav from '../components/DashboardNav';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import TasksDetails from '../components/TasksDetails';
import Creation from '../assets/Creation.png';
import { useAuthContext } from '../hooks/useAuthContext';

const DashboardList = () => {
  const navigate = useNavigate();
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://209.38.250.1:4000/api/tasks', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const tasksArray = Array.isArray(response.data) ? response.data : [response.data];
        dispatch({ type: 'SET_TASKS', payload: tasksArray });
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
          {tasks && tasks.length > 0 ? (
            <div className='tasks'>
              {tasks.map((task) => (
                <TasksDetails key={task?._id} task={task} subtasks={task?.subtasks} />
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                  <h1>Create your first Project Task</h1>
                  <Button
                    variant='contained'
                    color='success'
                    onClick={() => {
                      navigate('/dashboard/add');
                    }}
                  >
                    Let's Go
                  </Button>
                </div>
                <img src={Creation} alt='First Task' width={800} />
              </div>
            </div>
          )}
        </div>
      </Box>
    </>
  );
};

export default DashboardList;
