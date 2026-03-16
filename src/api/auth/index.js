// authAPI.js
import axiosInstance from '../axios';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);

      // Tokenni to‘g‘ri saqlash
      if (response.data.token) {
        localStorage.setItem('tokenData', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);

      // Tokenni to‘g‘ri saqlash
      if (response.data.token) {
        localStorage.setItem('tokenData', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('tokenData');
  },
};