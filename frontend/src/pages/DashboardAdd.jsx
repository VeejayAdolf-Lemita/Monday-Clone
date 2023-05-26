import React from 'react';
import SideNav from '../components/Sidenav';
import DashboardNav from '../components/DashboardNav';
import Box from '@mui/material/Box';
import TaskForm from '../components/TaskForm';

const DashboardAdd = () => {
  return (
    <>
      <DashboardNav />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <TaskForm />
      </Box>
    </>
  );
};

export default DashboardAdd;
