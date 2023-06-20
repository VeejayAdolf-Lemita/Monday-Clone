import React from 'react';
import SideNav from '../components/Sidenav';
import DashboardNav from '../components/DashboardNav';
import Box from '@mui/material/Box';
import UserRole from '../components/UserRole';

const DashboardRole = () => {
  return (
    <>
      <DashboardNav />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <UserRole />
      </Box>
    </>
  );
};

export default DashboardRole;
