import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi } from '../api/authApi';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await loginApi({ username, password });
      
      if (response.data && response.data.token) {
        const userData = {
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(response.data.token);
        setUser(userData);
        
        toast.success('Login successful!');
        
        return { success: true, role: userData.role };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerApi(userData);
      
      if (response.data && response.data.token) {
        const newUser = {
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(response.data.token);
        setUser(newUser);
        
        toast.success('Registration successful!');
        
        return { success: true, role: newUser.role };
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('Registration error', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};