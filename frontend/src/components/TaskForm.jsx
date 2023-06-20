import { useState } from 'react';
import axios from 'axios';
import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    const task = { title };
    setDisable(true);

    try {
      const response = await axios.post('https://monday-vercel.vercel.app/api/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setTitle('');
        setError(null);
        dispatch({ type: 'CREATE_TASK', payload: response.data });
        setDisable(false);
        setShowSuccessAlert(true);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        className='create'
        onSubmit={handleSubmit}
        style={{
          width: '70%',
          marginTop: '6vh',
          height: '39vh',
          border: '1px dashed lightgrey',
          borderWidth: '4px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          alignItems: 'center',
          padding: '54px',
        }}
      >
        <h3>CREATE PROJECT BOARD</h3>
        <input type='text' onChange={(e) => setTitle(e.target.value)} value={title} />
        <button disabled={disable}>Submit</button>
        {error && <div className='error'>{error}</div>}
      </form>
      {showSuccessAlert && (
        <Stack
          sx={{ position: 'fixed', bottom: 16, right: 16, width: 320, zIndex: 9999 }}
          spacing={2}
        >
          <Alert severity='success' onClose={handleAlertClose}>
            <AlertTitle>Success</AlertTitle>
            Your Project Board is added successfully —{' '}
            <strong>check it out! on Project List</strong>
          </Alert>
        </Stack>
      )}
    </div>
  );
};

export default TaskForm;
