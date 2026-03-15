import axiosInstance from '../axios';

export const accountsAPI = {
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/accounts', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch accounts' };
    }
  },

  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/accounts/${id}/`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch account' };
    }
  },

  create: async (accountData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.post('/accounts', accountData, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create account' };
    }
  },

  update: async (id, accountData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.patch(`/accounts/${id}`, accountData, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update account' };
    }
  },

  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));

      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/accounts/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete account' };
    }
  },
};