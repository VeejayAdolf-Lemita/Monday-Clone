import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const UserRole = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData) {
          const response = await fetch('https://monday-vercel.vercel.app/api/user');
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleOpen = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRoleSubmit = async () => {
    try {
      // Make the API call to update the user's role
      await fetch(`https://monday-vercel.vercel.app/api/user/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      // Fetch the updated user data
      const response = await fetch('https://monday-vercel.vercel.app/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch updated user data');
      }
      const data = await response.json();
      setUserData(data);

      // Close the modal
      handleClose();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        'This user will be deleted permanently. Are you sure you want to proceed?',
      );
      if (!confirmDelete) {
        return;
      }

      await fetch(`https://monday-vercel.vercel.app/api/user/${userId}`, {
        method: 'DELETE',
      });
      const response = await fetch('https://monday-vercel.vercel.app/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch updated user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={{ marginTop: '10vh' }}>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            {selectedUser && (
              <>
                <Typography style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
                  Edit Role
                </Typography>
                <Typography
                  variant='h6'
                  component='h2'
                  style={{ textAlign: 'center', marginBottom: '1rem' }}
                >
                  email: {selectedUser.email}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label' sx={{ background: '#fff' }}>
                    ROLE
                  </InputLabel>
                  <Select
                    id='demo-simple-select-label'
                    labelId='demo-simple-select-label'
                    label='Priority'
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <MenuItem value='user'>User</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>
                </FormControl>
                <Stack
                  direction='row'
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1.5rem',
                    gap: '1rem',
                  }}
                >
                  <Button variant='contained' color='error' onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant='contained' onClick={handleRoleSubmit}>
                    Change Role
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </Modal>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '76vw' }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: '600', color: 'rgb(101 98 98)' }}>USERNAME</TableCell>
              <TableCell align='right' style={{ fontWeight: '600', color: 'rgb(101 98 98)' }}>
                ROLE
              </TableCell>
              <TableCell align='right' style={{ fontWeight: '600', color: 'rgb(101 98 98)' }}>
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData ? (
              userData.map((user) => (
                <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {user.email}
                  </TableCell>
                  <TableCell align='right'>{user.role}</TableCell>
                  <TableCell align='right'>
                    <EditIcon
                      style={{
                        color: '#fff',
                        marginRight: '5px',
                        padding: 3,
                        cursor: 'pointer',
                        backgroundColor: '#1aac83',
                        borderRadius: 3,
                      }}
                      onClick={() => handleOpen(user)}
                    />
                    <DeleteForeverIcon
                      style={{
                        color: '#fff',
                        cursor: 'pointer',
                        padding: 3,
                        backgroundColor: 'red',
                        borderRadius: 3,
                      }}
                      onClick={() => handleDeleteUser(user._id)} // Pass user._id as the parameter
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Loading data...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserRole;
