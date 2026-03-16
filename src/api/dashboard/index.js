import axiosInstance from "../axios";

// Katta sonlarni formatlash uchun yordamchi funksiya
const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  // String dan nuqtani olib tashlab, number ga convert qilish
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

// Transaction kind ni mapping qilish
// const mapKindToIcon = (kind) => {
//   switch(kind) {
//     case 'income': return 'trending-up';
//     case 'expense': return 'shopping-bag';
//     case 'transfer': return 'arrow-left-right';
//     default: return 'plus';
//   }
// };

export const dashboardAPI = {
  // GET dashboard data
  getDashboard: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/dashboard', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      const data = response.data;
      
      // Format dashboard data
      return {
        total_balance: parseBigNumber(data.total_balance),
        total_income: parseBigNumber(data.total_income),
        total_expense: parseBigNumber(data.total_expense),
        net: parseBigNumber(data.net),
        accounts: (data.accounts || []).map(account => ({
          id: account.id,
          name: account.name || '',
          type: account.type || 'CASH',
          currency: account.currency || 'UZS',
          bank_name: account.bank_name || '',
          branch_name: account.branch_name || '',
          account_number: account.account_number || '',
          initial_balance: parseBigNumber(account.initial_balance),
          current_balance: parseBigNumber(account.current_balance)
        })),
        recent_transactions: (data.recent_transactions || []).map(tx => ({
          id: tx.id,
          kind: tx.kind || 'expense',
          account_id: tx.account_id,
          account_name: tx.account_name || '',
          account_type: tx.account_type || 'CASH',
          currency: tx.currency || 'UZS',
          amount: parseBigNumber(tx.amount),
          date: tx.date || new Date().toISOString().slice(0, 10),
          category: tx.category || 'Other',
          title: tx.title || tx.merchant || 'Transaction',
          merchant: tx.merchant || '',
          payment_method: tx.payment_method || ''
        })),
        top_categories: (data.top_categories || []).map(cat => ({
          category: cat.category || 'Other',
          total: parseBigNumber(cat.total)
        }))
      };
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  }
};