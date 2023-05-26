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

const TaskDetails = ({ task, subtasks }) => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [member, setMember] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Todo');
  const { dispatch } = useTasksContext();
  const [open, setOpen] = useState(false);
  const [subtaskId, setSubtaskId] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { tasks } = useTasksContext();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/user/');
        const data = response.data;
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
        const res = await axios.get(`/api/tasks/${task._id}/subtasks`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        dispatch({ type: 'GET_SUBTASK', payload: { data: res.data, taskId: task._id } });
      } catch (err) {
        console.error(err.response.data);
      }
    };
    getSubtasks();
  }, [task._id, dispatch, user.token]);

  async function addSubtask(newSubtask) {
    try {
      // Send POST request to create new subtask
      const res = await axios.post(`/api/tasks/${task._id}/subtasks`, newSubtask, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({ type: 'CREATE_SUBTASK', payload: { data: res.data, taskId: task._id } });
    } catch (err) {
      console.error(err);
    }
  }

  const deleteSubtask = async (subtaskId) => {
    try {
      await axios.delete(`/api/tasks/${task._id}/subtasks/${subtaskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({ type: 'DELETE_SUBTASK', payload: { subtaskId, taskId: task._id } });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/tasks/' + task._id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      const deleteTask = (taskId) => {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      };
      deleteTask(task._id); // Call the deleteTask function here
    }
  };

  const editSubtask = (subtaskId) => {
    const subtaskToEdit = subtasks.find((subtask) => subtask._id === subtaskId);
    setName(subtaskToEdit.name);
    setMember(subtaskToEdit.member);
    setDescription(subtaskToEdit.description);
    setRole(subtaskToEdit.role);
    setStatus(subtaskToEdit.status);
    setSubtaskId(subtaskId);
    setOpen(true);
  };

  const updateSubtask = async (e, subtaskId) => {
    e.preventDefault();
    const updatedSubtask = { name, member, description, role, status };
    try {
      const res = await axios.put(`/api/tasks/${task._id}/subtasks/${subtaskId}`, updatedSubtask, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({ type: 'UPDATE_SUBTASK', payload: res.data });
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='task-details'>
      <h4>{task.title}</h4>
      <SubtaskForm taskId={task._id} addSubtask={addSubtask} />
      {subtasks?.length > 0 ? (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <form onSubmit={updateSubtask}>
                <div>
                  <input
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <select value={member} onChange={(e) => setMember(e.target.value)}>
                    {users.map((user) => (
                      <option key={user._id} value={user.email}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type='text'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={25}
                    required
                  />
                </div>
                <div>
                  <input
                    type='text'
                    placeholder='Role'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value='Todo'>To Do</option>
                    <option value='In progress'>In Progress</option>
                    <option value='Completed'>Done</option>
                  </select>
                </div>
                <button type='submit' onClick={(e) => updateSubtask(e, subtaskId)}>
                  Update Subtask
                </button>
              </form>
            </Box>
          </Modal>
          <Table sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: '40px' }}></th>
                <th>Person</th>
                <th>Description</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((subtask) => (
                <tr key={subtask._id}>
                  <td>{subtask.name}</td>
                  <td style={{ width: '40px', cursor: 'pointer' }}>
                    <SideDrawer subtask={subtask} task={task} />
                  </td>
                  <td>{subtask.member}</td>
                  <td>{subtask.description}</td>
                  <td>{subtask.role}</td>
                  <td>{subtask.status}</td>
                  <td>
                    <EditIcon
                      onClick={(handleOpen, () => editSubtask(subtask._id))}
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
                      onClick={() => deleteSubtask(subtask._id)}
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
        <Table sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
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
            <p>No subtasks found.</p>
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
