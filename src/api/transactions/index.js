// transactionsAPI.js
import axiosInstance from '../axios';

export const transactionsAPI = {
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/transactions', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch transactions' };
    }
  },

  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/transactions/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch transaction' };
    }
  },

  create: async (transactionData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.post('/transactions', transactionData, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create transaction' };
    }
  },

  update: async (id, transactionData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.put(`/transactions/${id}`, transactionData, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update transaction' };
    }
  },

  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete transaction' };
    }
  },
};