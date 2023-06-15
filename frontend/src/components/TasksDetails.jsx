import React, { useState, useEffect } from 'react';
import Table from '@mui/joy/Table';
import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';
import SubtaskForm from './SubtaskForm';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SideDrawer from './SideDrawer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FormControl, MenuItem, Select, InputLabel, TextField, Button } from '@mui/material';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import useDrivePicker from 'react-google-drive-picker';
import CircularProgress from '@mui/material/CircularProgress';

const TaskDetails = ({ task, subtasks }) => {
  const [openPicker] = useDrivePicker();
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [member, setMember] = useState([]);
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Todo');
  const { dispatch } = useTasksContext();
  const [open, setOpen] = useState(false);
  const [subtaskId, setSubtaskId] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModal2, setOpenModal2] = useState(false); // Added modal state
  const handleOpenModal2 = () => setOpenModal2(true);
  const handleCloseModal2 = () => setOpenModal2(false);
  const [fileId, setFileId] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const clientId = '141276615955-agrh2cdhddbgt9rh70hk7nvoldgs85sc.apps.googleusercontent.com';
    const clientSecret = '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';
    const refreshToken =
      '1//04SwRA9OKAaKmCgYIARAAGAQSNwF-L9IrM_Hyeg4rHdhtZ1n_M5vjMuV9VYehTCApNKMJEizTnU5wrxgJy99XiFk-8JJdYm1jWK8';

    try {
      const response = await axios.post(
        '/transfer-ownership',
        {
          fileId: fileId,
          newOwnerEmail: newOwnerEmail,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFileId('');
      setNewOwnerEmail('');
      alert(`Ownership transferred to ${newOwnerEmail} successfully`);
      handleCloseModal2();
      console.log(response.data);
      setIsLoading(false);
    } catch (err) {
      setFileId('');
      setNewOwnerEmail('');
      handleCloseModal2();
      console.log(`Error transferring ownership: ${err}`);
      setIsLoading(false);
    }
  };

  const handleOpenPicker = async () => {
    const refreshToken =
      '1//04niFPzvurNAhCgYIARAAGAQSNwF-L9Ir6NQ3crIuy28eEnObNFXX7rjQxro9tqPedwAv-e-V57mUDsQhV-_YCo8TDlzg2Bk6wfI';
    const clientSecret = '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';
    const clientId = '141276615955-agrh2cdhddbgt9rh70hk7nvoldgs85sc.apps.googleusercontent.com';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': 'google-oauth-playground',
      },
      body: `client_secret=${encodeURIComponent(
        clientSecret,
      )}&grant_type=refresh_token&refresh_token=${encodeURIComponent(
        refreshToken,
      )}&client_id=${encodeURIComponent(clientId)}`,
    };

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', requestOptions);
      const data = await response.json();
      const newToken = data.access_token;

      openPicker({
        clientId: clientId,
        developerKey: 'AIzaSyA8-dSoevc1HI-1ClrPo0Iql3oWT8GBzsA',
        viewId: 'DOCS_AND_FOLDERS',
        token: newToken,
        showUploadView: true,
        showUploadFolders: true,
        setOwnedByMe: false,
        supportDrives: true,
        multiselect: true,
        callbackFunction: (data) => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button');
            setToken(newToken);
          }
          if (data.action === 'picked') {
            setFileId(data.docs[0]['id']);
            handleOpenModal2();
          } else console.log(data);
        },
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const { tasks } = useTasksContext();

  const style = {
    border: '0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://209.38.250.1:4000/api/user/');
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  console.log(tasks);

  useEffect(() => {
    const getSubtasks = async () => {
      try {
        const response = await axios.get(`http://209.38.250.1:4000/api/tasks/${task.id}/subtasks`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log(data, 'response');
        dispatch({ type: 'GET_SUBTASK', payload: { data, taskId: task.id } });
      } catch (err) {
        console.error(err.response.data);
      }
    };
    getSubtasks();
  }, [task.id, dispatch, user.token]);

  async function addSubtask(newSubtask) {
    try {
      // Send POST request to create new subtask
      const res = await axios.post(
        `http://209.38.250.1:4000/api/tasks/${task.id}/subtasks`,
        newSubtask,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      dispatch({ type: 'CREATE_SUBTASK', payload: { data: res.data, taskId: task.id } });
    } catch (err) {
      console.error(err);
    }
  }

  const deleteSubtask = async (subtaskId) => {
    try {
      await axios.delete(`http://209.38.250.1:4000/api/tasks/${task.id}/subtasks/${subtaskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({ type: 'DELETE_SUBTASK', payload: { subtaskId, taskId: task.id } });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('http://209.38.250.1:4000/api/tasks/' + task.id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      const deleteTask = (taskId) => {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      };
      deleteTask(task.id); // Call the deleteTask function here
    }
  };

  const editSubtask = (subtaskId) => {
    const subtaskToEdit = subtasks.find((subtask) => subtask.id === subtaskId);
    if (subtaskToEdit) {
      console.log(subtaskToEdit);
      setName(subtaskToEdit.name);
      setMember(subtaskToEdit.member);
      setDescription(subtaskToEdit.description);
      setRole(subtaskToEdit.role);
      setStatus(subtaskToEdit.status);
      setSubtaskId(subtaskId);
      setOpen(true);
    }
  };

  const updateSubtask = async (e, subtaskId) => {
    e.preventDefault();
    const updatedSubtask = { name, member, description, role, status };
    try {
      const res = await axios.put(
        `http://209.38.250.1:4000/api/tasks/${task._id}/subtasks/${subtaskId}`,
        updatedSubtask,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      dispatch({ type: 'UPDATE_SUBTASK', payload: res.data });
      handleClose();
      setBtnDisabled(false);
    } catch (err) {
      console.error('Error updating subtask:', err);
      // Handle the error appropriately
    }
  };

  return (
    <div className='task-details'>
      <Modal
        open={openModal2}
        onClose={handleCloseModal2}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        {!isLoading ? (
          <Box sx={style}>
            <form onSubmit={handleSubmit}>
              <TextField
                id='fileId'
                label='File ID'
                value={fileId}
                onChange={(event) => setFileId(event.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
                required
              />
              <TextField
                id='newOwnerEmail'
                label='New Owner Email'
                value={newOwnerEmail}
                onChange={(event) => setNewOwnerEmail(event.target.value)}
                margin='normal'
                variant='outlined'
                fullWidth
                required
              />
              <Button type='submit' variant='contained'>
                Transfer Ownership
              </Button>
            </form>
          </Box>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 50,
            }}
          >
            <CircularProgress sx={{ color: '#fff' }} />
          </div>
        )}
      </Modal>
      <h4>{task.title}</h4>
      <SubtaskForm taskId={task.id} addSubtask={addSubtask} />
      {subtasks?.length > 0 ? (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <h1 style={{ textAlign: 'center' }}>Edit Task</h1>
              <form onSubmit={updateSubtask}>
                <div>
                  <TextField
                    id='outlined-basic'
                    label='Name'
                    variant='outlined'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <Box sx={{ minWidth: 120, margin: '1rem 0' }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label' sx={{ background: '#fff' }}>
                        Person
                      </InputLabel>
                      <Select
                        id='demo-simple-select-label'
                        labelId='demo-simple-select-label'
                        value={member}
                        label='Priority'
                        onChange={(e) => setMember(e.target.value)}
                        multiple
                      >
                        {member.map((mem) => (
                          <MenuItem key={mem.id} value={mem}>
                            {mem.email}
                          </MenuItem>
                        ))}
                        {users
                          .filter((user) => {
                            return !member.some((mem) => {
                              return user.id === mem.id;
                            });
                          })
                          .map((opt) => (
                            <MenuItem key={opt.id} value={opt}>
                              {opt.email}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div>
                  <TextField
                    id='outlined-basic'
                    label='Description'
                    variant='outlined'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <Box sx={{ minWidth: 120, margin: '1rem 0' }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label' sx={{ background: '#fff' }}>
                        Priority
                      </InputLabel>
                      <Select
                        id='demo-simple-select-label'
                        labelId='demo-simple-select-label'
                        value={role}
                        label='Priority'
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <MenuItem value='Low'>Low</MenuItem>
                        <MenuItem value='Mid'>Mid</MenuItem>
                        <MenuItem value='High'>High</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div>
                  <Box sx={{ minWidth: 120, margin: '1rem 0' }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label' sx={{ background: '#fff' }}>
                        Status
                      </InputLabel>
                      <Select
                        id='demo-simple-select-label'
                        labelId='demo-simple-select-label'
                        value={status}
                        label='Priority'
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <MenuItem value='Getting Started'>Getting Started</MenuItem>
                        <MenuItem value='Working on it'>Working on it</MenuItem>
                        <MenuItem value='Stuck'>Stuck</MenuItem>
                        <MenuItem value='Done'>Done</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <button
                  type='submit'
                  onClick={(e) => {
                    setBtnDisabled(true); // Disable the button
                    updateSubtask(e, subtaskId);
                  }}
                  disabled={btnDisabled}
                  style={{ cursor: 'pointer' }}
                >
                  Update
                </button>
              </form>
            </Box>
          </Modal>
          <Table sx={{ '& tr > *:not(:first-of-type': { textAlign: 'right' } }}>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: '40px' }}></th>
                <th style={{ maxWidth: '40px', textAlign: 'center' }}>Person</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((subtask) => (
                <tr key={subtask.id}>
                  <td>{subtask.name}</td>
                  <td style={{ width: '40px', cursor: 'pointer' }}>
                    <SideDrawer subtask={subtask} task={task} />
                  </td>
                  <td
                    style={{ maxWidth: '40px', textAlign: 'center', cursor: 'pointer' }}
                    onClick={(handleOpen, () => editSubtask(subtask.id))}
                  >
                    <AccountCircleIcon />
                  </td>
                  <td>{subtask.description}</td>
                  <td>{subtask.role}</td>
                  <td>{subtask.status}</td>
                  <td>
                    <AddToDriveIcon
                      style={{
                        color: '#fff',
                        marginRight: '5px',
                        padding: 3,
                        cursor: 'pointer',
                        backgroundColor: '#1976d2',
                        borderRadius: 3,
                      }}
                      onClick={() => handleOpenPicker()}
                    />
                    <EditIcon
                      onClick={(handleOpen, () => editSubtask(subtask.id))}
                      style={{
                        color: '#fff',
                        marginRight: '5px',
                        padding: 3,
                        cursor: 'pointer',
                        backgroundColor: '#1aac83',
                        borderRadius: 3,
                      }}
                    />
                    <DeleteForeverIcon
                      onClick={() => deleteSubtask(subtask.id)}
                      style={{
                        color: '#fff',
                        cursor: 'pointer',
                        padding: 3,
                        backgroundColor: 'red',
                        borderRadius: 3,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Table sx={{ '& tr > *:not(:first-of-type)': { textAlign: 'right' } }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No Tasks Found. Click "ADD TASK" to begin</td>
            </tr>
          </tbody>
        </Table>
      )}
      <p style={{ width: '100%' }}>{task.createdAt}</p>
      <span>
        <RemoveCircleIcon onClick={handleClick} style={{ color: 'red' }} />
      </span>
    </div>
  );
};

export default TaskDetails;
