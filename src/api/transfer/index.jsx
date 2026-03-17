import axiosInstance from "../axios";

const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

export const transfersAPI = {
  // GET all transfers
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/transfers', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return (response.data || []).map(transfer => ({
        id: transfer.id,
        from_account_id: transfer.from_account_id,
        to_account_id: transfer.to_account_id,
        from_amount: parseBigNumber(transfer.from_amount),
        to_amount: parseBigNumber(transfer.to_amount),
        exchange_rate: parseBigNumber(transfer.exchange_rate),
        transferred_at: transfer.transferred_at,
        note: transfer.note || ''
      }));
    } catch (error) {
      console.error('Get transfers error:', error);
      throw error;
    }
  },

  // GET transfer by id
  getById: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get(`/transfers/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        from_account_id: data.from_account_id,
        to_account_id: data.to_account_id,
        from_amount: parseBigNumber(data.from_amount),
        to_amount: parseBigNumber(data.to_amount),
        exchange_rate: parseBigNumber(data.exchange_rate),
        transferred_at: data.transferred_at,
        note: data.note || ''
      };
    } catch (error) {
      console.error(`Get transfer ${id} error:`, error);
      throw error;
    }
  },

  // POST create transfer
  create: async (transferData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        from_account_id: transferData.from_account_id,
        to_account_id: transferData.to_account_id,
        from_amount: parseFloat(transferData.from_amount) || 0,
        exchange_rate: parseFloat(transferData.exchange_rate) || 1,
        to_amount: parseFloat(transferData.to_amount) || 0,
        transferred_at: transferData.transferred_at,
        note: transferData.note || ''
      };

      console.log('Sending transfer payload:', payload); // Debug uchun

      const response = await axiosInstance.post('/transfers', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create transfer error:', error);
      console.error('Error response:', error.response?.data); // Debug uchun
      throw error.response?.data || { error: 'Failed to create transfer' };
    }
  },

  // DELETE transfer
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/transfers/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete transfer error:', error);
      throw error.response?.data || { error: 'Failed to delete transfer' };
    }
  }
};