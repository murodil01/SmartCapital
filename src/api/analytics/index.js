import axiosInstance from '../axios';

// Katta sonlarni formatlash uchun yordamchi funksiya
const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  // String dan nuqtani olib tashlab, number ga convert qilish
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, '');
  return parseFloat(cleanStr) || 0;
};

// Safe fetch funksiyasi - har doim ma'lumot qaytaradi
// const safeFetch = async (apiCall, defaultValue = null) => {
//   try {
//     return await apiCall();
//   } catch (error) {
//     console.warn('API fetch failed:', error);
//     return defaultValue;
//   }
// };

export const analyticsAPI = {
  // GET overview - umumiy statistika
  getOverview: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/analytics/overview', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Katta sonlarni formatlash
      const data = response.data;
      return {
        total_income: parseBigNumber(data.total_income),
        total_expense: parseBigNumber(data.total_expense),
        net: parseBigNumber(data.net),
        raw: data
      };
    } catch (error) {
      console.error('Overview fetch error:', error);
      // Default qiymat qaytarish
      return {
        total_income: 0,
        total_expense: 0,
        net: 0,
        raw: null
      };
    }
  },

  // GET by-category - kategoriyalar bo'yicha (income yoki expense)
  getByCategory: async (kind = 'expense') => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Kind parametrini tekshirish
      const validKind = ['income', 'expense'].includes(kind) ? kind : 'expense';

      const response = await axiosInstance.get(`/analytics/by-category?kind=${validKind}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Agar items mavjud bo'lmasa, bo'sh array qaytarish
      if (!response.data || !response.data.items) {
        return [];
      }

      // Har bir item dagi total ni formatlash
      return response.data.items.map(item => ({
        category: item.category || 'Unknown',
        total: parseBigNumber(item.total)
      }));
    } catch (error) {
      console.error(`Category fetch error (${kind}):`, error);
      // Bo'sh array qaytarish
      return [];
    }
  },

  // GET expense-vs-income-by-category - income vs expense comparison
  getComparison: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/analytics/expense-vs-income-by-category', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Agar items mavjud bo'lmasa, bo'sh array qaytarish
      if (!response.data || !response.data.items) {
        return [];
      }

      // Barcha sonlarni formatlash
      return response.data.items.map(item => ({
        category: item.category || 'Unknown',
        income: parseBigNumber(item.income),
        expense: parseBigNumber(item.expense),
        net: parseBigNumber(item.net)
      }));
    } catch (error) {
      console.error('Comparison fetch error:', error);
      return [];
    }
  },

  // GET timeline - vaqt bo'yicha ma'lumotlar
  getTimeline: async (kind = 'all', granularity = 'month') => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Valid kind va granularity
      const validKind = ['income', 'expense', 'all'].includes(kind) ? kind : 'all';
      const validGranularity = ['day', 'week', 'month', 'year'].includes(granularity) ? granularity : 'month';

      // Parametrlarni to'g'ri formatda yuborish
      const params = new URLSearchParams();
      if (validKind !== 'all') {
        params.append('kind', validKind);
      }
      params.append('granularity', validGranularity);

      const response = await axiosInstance.get(`/analytics/timeline?${params.toString()}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Agar points mavjud bo'lmasa, bo'sh object qaytarish
      if (!response.data) {
        return {
          kind: validKind,
          granularity: validGranularity,
          points: []
        };
      }

      // Points dagi total ni formatlash
      const points = (response.data.points || []).map(point => ({
        bucket: point.bucket || '',
        total: parseBigNumber(point.total)
      }));

      return {
        kind: response.data.kind || validKind,
        granularity: response.data.granularity || validGranularity,
        points
      };
    } catch (error) {
      console.error('Timeline fetch error:', error);
      // Default qiymat qaytarish
      return {
        kind: kind,
        granularity: granularity,
        points: []
      };
    }
  },

  // GET calendar - kalendar ko'rinishi
  getCalendar: async (startDate, endDate) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Parametrlarni qo'shish (agar kerak bo'lsa)
      let url = '/analytics/calendar';
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('start_date', startDate);
      }
      if (endDate) {
        params.append('end_date', endDate);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Agar response array bo'lmasa, bo'sh array qaytarish
      if (!Array.isArray(response.data)) {
        return [];
      }

      // Har bir kun uchun sonlarni formatlash
      return response.data.map(day => ({
        date: day.date || new Date().toISOString().split('T')[0],
        income: parseBigNumber(day.income),
        expense: parseBigNumber(day.expense),
        net: parseBigNumber(day.net)
      }));
    } catch (error) {
      console.error('Calendar fetch error:', error);
      // Bo'sh array qaytarish
      return [];
    }
  }
};