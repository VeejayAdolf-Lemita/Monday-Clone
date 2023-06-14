import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://veejay.servehttp.com//api/user/signup', {
        email,
        password,
      });
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
  return { signup, isLoading, error };
};
