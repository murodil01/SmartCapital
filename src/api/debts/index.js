import axiosInstance from "../axios";

// Katta sonlarni formatlash uchun yordamchi funksiya
const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  // String dan nuqtani olib tashlab, number ga convert qilish
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

export const debtsAPI = {
  // GET all debts
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/debts', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Format each debt
      return (response.data || []).map(debt => ({
        id: debt.id,
        kind: debt.kind || 'DEBT',
        person_name: debt.person_name || '',
        amount: parseBigNumber(debt.amount),
        currency: debt.currency || 'UZS',
        status: debt.status || 'OPEN',
        due_date: debt.due_date,
        note: debt.note || ''
      }));
    } catch (error) {
      console.error('Get all debts error:', error);
      throw error;
    }
  },

  // GET debt by id
  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/debts/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        kind: data.kind || 'DEBT',
        person_name: data.person_name || '',
        amount: parseBigNumber(data.amount),
        currency: data.currency || 'UZS',
        status: data.status || 'OPEN',
        due_date: data.due_date,
        note: data.note || ''
      };
    } catch (error) {
      console.error(`Get debt by id ${id} error:`, error);
      throw error;
    }
  },

  // POST create debt
  create: async (debtData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Format data for backend
      const payload = {
        kind: debtData.kind,
        person_name: debtData.person_name,
        amount: debtData.amount?.toString() || "0",
        currency: debtData.currency || "UZS",
        status: debtData.status,
        due_date: debtData.due_date,
        note: debtData.note || ""
      };

      const response = await axiosInstance.post('/debts', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create debt' };
    }
  },

  // PATCH update debt
  update: async (id, debtData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Format data for backend
      const payload = {
        kind: debtData.kind,
        person_name: debtData.person_name,
        amount: debtData.amount?.toString() || "0",
        currency: debtData.currency || "UZS",
        status: debtData.status,
        due_date: debtData.due_date,
        note: debtData.note || ""
      };

      const response = await axiosInstance.patch(`/debts/${id}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update debt' };
    }
  },

  // DELETE debt
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/debts/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete debt' };
    }
  }
};