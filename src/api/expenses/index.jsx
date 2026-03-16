import axiosInstance from "../axios";

const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

export const expensesAPI = {
  // GET all expenses
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/expenses', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return (response.data || []).map(expense => ({
        id: expense.id,
        account_id: expense.account_id,
        amount: parseBigNumber(expense.amount),
        spent_at: expense.spent_at,
        description: expense.description || '',
        merchant: expense.merchant || '',
        category: expense.category || 'Other'
      }));
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  },

  // GET expense by id
  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/expenses/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        account_id: data.account_id,
        amount: parseBigNumber(data.amount),
        spent_at: data.spent_at,
        description: data.description || '',
        merchant: data.merchant || '',
        category: data.category || 'Other'
      };
    } catch (error) {
      console.error(`Get expense ${id} error:`, error);
      throw error;
    }
  },

  // POST create expense
  create: async (expenseData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        account_id: expenseData.account_id,
        amount: parseFloat(expenseData.amount) || 0,
        spent_at: expenseData.spent_at,
        description: expenseData.description || '',
        merchant: expenseData.merchant || '',
        category: expenseData.category
      };

      const response = await axiosInstance.post('/expenses', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create expense error:', error);
      throw error.response?.data || { error: 'Failed to create expense' };
    }
  },

  // PATCH update expense
  update: async (id, expenseData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        account_id: expenseData.account_id,
        amount: parseFloat(expenseData.amount) || 0,
        spent_at: expenseData.spent_at,
        description: expenseData.description || '',
        merchant: expenseData.merchant || '',
        category: expenseData.category
      };

      const response = await axiosInstance.patch(`/expenses/${id}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update expense error:', error);
      throw error.response?.data || { error: 'Failed to update expense' };
    }
  },

  // DELETE expense
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error.response?.data || { error: 'Failed to delete expense' };
    }
  }
};