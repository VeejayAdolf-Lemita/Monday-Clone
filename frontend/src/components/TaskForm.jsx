import { useState } from 'react';
import axios from 'axios';
import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    const task = { title };

    try {
      const response = await axios.post('/api/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setTitle('');
        setError(null);
        console.log('New task added', response.data);
        dispatch({ type: 'CREATE_TASK', payload: response.data });
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <form className='create' onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>
      <label>Title:</label>
      <input type='text' onChange={(e) => setTitle(e.target.value)} value={title} />
      <button>Submit</button>
      {error && <div className='error'>{error}</div>}
    </form>
  );
};

export default TaskForm;
