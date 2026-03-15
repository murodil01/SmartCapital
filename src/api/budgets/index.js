import axiosInstance from '../axios';

// Katta sonlarni formatlash uchun yordamchi funksiya
const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  // String dan nuqtani olib tashlab, number ga convert qilish
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

export const budgetsAPI = {
  // GET all budgets
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/budgets', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Format each budget
      return (response.data || []).map(budget => ({
        id: budget.id,
        month: budget.month || new Date().toISOString().slice(0, 7),
        income_target: parseBigNumber(budget.income_target),
        category_limits: (budget.category_limits || []).map(limit => ({
          id: limit.id,
          category: limit.category || 'Unknown',
          limit_amount: parseBigNumber(limit.limit_amount)
        }))
      }));
    } catch (error) {
      console.error('Get all budgets error:', error);
      throw error;
    }
  },

  // GET budget by month
  getByMonth: async (month) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/budgets/${month}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        month: data.month || month,
        income_target: parseBigNumber(data.income_target),
        category_limits: (data.category_limits || []).map(limit => ({
          id: limit.id,
          category: limit.category || 'Unknown',
          limit_amount: parseBigNumber(limit.limit_amount)
        }))
      };
    } catch (error) {
      console.error(`Get budget by month ${month} error:`, error);
      throw error;
    }
  },

  // POST create budget
  create: async (budgetData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Format data for backend
      const payload = {
        month: budgetData.month,
        income_target: budgetData.income_target?.toString() || "0",
        category_limits: (budgetData.category_limits || []).map(limit => ({
          category: limit.category,
          limit_amount: limit.limit_amount?.toString() || "0"
        }))
      };

      const response = await axiosInstance.post('/budgets', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error.response?.data || { error: 'Failed to create budget' };
    }
  },

  // GET budget comparison by month
  getComparison: async (month) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/budgets/${month}/comparison`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        month: data.month || month,
        income_target: parseBigNumber(data.income_target),
        actual_income: parseBigNumber(data.actual_income),
        income_delta: parseBigNumber(data.income_delta),
        category_results: (data.category_results || []).map(result => ({
          category: result.category || 'Unknown',
          limit_amount: parseBigNumber(result.limit_amount),
          actual_spent: parseBigNumber(result.actual_spent),
          remaining: parseBigNumber(result.remaining),
          exceeded: result.exceeded || false
        })),
        unplanned_expenses: (data.unplanned_expenses || []).map(expense => ({
          category: expense.category || 'Unknown',
          total: parseBigNumber(expense.total)
        }))
      };
    } catch (error) {
      console.error(`Get comparison for month ${month} error:`, error);
      throw error;
    }
  },

  // PUT update budget
  update: async (month, budgetData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Format data for backend
      const payload = {
        month: budgetData.month || month,
        income_target: budgetData.income_target?.toString() || "0",
        category_limits: (budgetData.category_limits || []).map(limit => ({
          category: limit.category,
          limit_amount: limit.limit_amount?.toString() || "0"
        }))
      };

      const response = await axiosInstance.put(`/budgets/${month}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error.response?.data || { error: 'Failed to update budget' };
    }
  },

  // DELETE budget
  delete: async (month) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/budgets/${month}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error.response?.data || { error: 'Failed to delete budget' };
    }
  }
};