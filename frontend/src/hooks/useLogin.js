import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/user/login', { email, password });
      const json = response.data;

      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the AuthContext
      dispatch({ type: 'LOGIN', payload: json });
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
