import axiosInstance from "../axios";

const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

export const incomesAPI = {
  // GET all incomes
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/incomes', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return (response.data || []).map(income => ({
        id: income.id,
        account_id: income.account_id,
        amount: parseBigNumber(income.amount),
        received_at: income.received_at,
        source: income.source || '',
        category: income.category || 'Other'
      }));
    } catch (error) {
      console.error('Get incomes error:', error);
      throw error;
    }
  },

  // GET income by id
  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/incomes/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        account_id: data.account_id,
        amount: parseBigNumber(data.amount),
        received_at: data.received_at,
        source: data.source || '',
        category: data.category || 'Other'
      };
    } catch (error) {
      console.error(`Get income ${id} error:`, error);
      throw error;
    }
  },

  // POST create income
  create: async (incomeData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        account_id: incomeData.account_id,
        amount: parseFloat(incomeData.amount) || 0,
        received_at: incomeData.received_at,
        source: incomeData.source || '',
        category: incomeData.category
      };

      const response = await axiosInstance.post('/incomes', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create income error:', error);
      throw error.response?.data || { error: 'Failed to create income' };
    }
  },

  // PATCH update income
  update: async (id, incomeData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        account_id: incomeData.account_id,
        amount: parseFloat(incomeData.amount) || 0,
        received_at: incomeData.received_at,
        source: incomeData.source || '',
        category: incomeData.category
      };

      const response = await axiosInstance.patch(`/incomes/${id}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update income error:', error);
      throw error.response?.data || { error: 'Failed to update income' };
    }
  },

  // DELETE income
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/incomes/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete income error:', error);
      throw error.response?.data || { error: 'Failed to delete income' };
    }
  }
};