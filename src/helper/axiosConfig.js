// src/utils/axiosHelper.js
import { message } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Create an axios instance with default config
export const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    "Access-Control-Allow-Origin": true
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle unauthorized errors (401)
    if (response && response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Handle forbidden errors (403)
    if (response && response.status === 403) {
      console.error('Permission denied');
      // Optional: redirect to access denied page
    }
    
    return Promise.reject(error);
  }
);

// Custom hook for GET requests
export const useAxiosGet = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, initialData]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, refetch };
};

// Function to handle POST requests
export const axiosPost = async (url, payload) => {
  try {
    const response = await axiosInstance.post(url, payload);
    return { data: response.data, error: null };
  } catch (error) {
    message.error(error?.response?.data?.message || ' Failed')
    
    return { data: null, error };
  }
};

// Function to handle PUT requests
export const axiosPut = async (url, payload) => {
  try {
    const response = await axiosInstance.put(url, payload);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Function to handle DELETE requests
export const axiosDelete = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Custom hook for managing API operations with loading states
export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleApiCall = async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await apiCall();
      
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, error, success, handleApiCall };
};