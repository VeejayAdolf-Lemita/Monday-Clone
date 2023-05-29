import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Select, MenuItem, InputLabel, Box, FormControl } from '@mui/material';

const SubtaskForm = ({ addSubtask }) => {
  const [name, setName] = useState('');
  const [member, setMember] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Getting Started');
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
      setStatus('Getting Started');
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
        <Typography>ADD PROJECT</Typography>
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
                maxLength={25}
                required
              />
            </div>
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
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id} required>
                      {user.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <div>
              <input
                type='text'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <button type='submit'>Add Subtask</button>
          </form>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default SubtaskForm;
