import { useState } from 'react';
import axios from 'axios';
import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    const task = { title };
    setDisable(true);

    try {
      const response = await axios.post('http://209.38.250.1:4000/api/tasks', task, {
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
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
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
    </div>
  );
};

export default TaskForm;
