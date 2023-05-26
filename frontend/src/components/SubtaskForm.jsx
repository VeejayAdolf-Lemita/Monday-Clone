import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SubtaskForm = ({ addSubtask }) => {
  const [name, setName] = useState('');
  const [member, setMember] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Todo');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/user/');
        const data = response.data; // Use response.data instead of response.json()
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubtask = { name, member, description, role, status };
    try {
      await addSubtask(newSubtask);
      setName('');
      setMember('');
      setDescription('');
      setRole('');
      setStatus('Todo');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>SUBTASK FORM</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <div>
              <select value={member} onChange={(e) => setMember(e.target.value)}>
                <option value=''>Choose Member</option>
                {users.map((user) => (
                  <option key={user._id} value={user.email} required>
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
                maxLength={20}
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
            <button type='submit'>Add Subtask</button>
          </form>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default SubtaskForm;
