import axiosInstance from "../axios";

export const calendarAPI = {
  // GET /calendar/year - yillik ma'lumotlarni olish
  getYearData: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.get("/calendar/year", {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch year data" };
    }
  },

  // GET /calendar/month?month=YYYY-MM - oylik ma'lumotlarni olish
  getMonthData: async (year, month) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      const monthStr = `${year}-${String(month).padStart(2, "0")}`;
      const response = await axiosInstance.get(
        `/calendar/month?month=${monthStr}`,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );

      // API dan kelgan ma'lumotlarni map qilish
      const data = response.data;
      if (Array.isArray(data)) {
        // Agar array bo'lsa, date bo'yicha map qilamiz
        const mappedData = {};
        data.forEach((item) => {
          mappedData[item.date] = {
            income: item.income || "0",
            expense: item.expense || "0",
            net: item.net || "0",
          };
        });
        return mappedData;
      }

      return data || {};
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch month data" };
    }
  },

  // GET /calendar/day?day=YYYY-MM-DD - kunlik ma'lumotlarni olish
  getDayData: async (year, month, day) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      // 1. Format month va day ni leading zero bilan
      const monthStr = String(month).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");

      // 2. To'liq sanani yaratish: YYYY-MM-DD
      const fullDate = `${year}-${monthStr}-${dayStr}`;

      // 3. MUHIM: Parametr nomi 'day' bo'lishi kerak, 'date' emas!
      const response = await axiosInstance.get(
        `/calendar/day?day=${fullDate}`,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );

      return response.data || null;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch day data" };
    }
  },

  // POST /calendar/transaction - yangi transaction qo'shish
  addTransaction: async (transactionData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        "/calendar/transaction",
        transactionData,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to add transaction" };
    }
  },

  // PUT /calendar/transaction/:id - transactionni tahrirlash
  updateTransaction: async (id, transactionData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.put(
        `/calendar/transaction/${id}`,
        transactionData,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update transaction" };
    }
  },

  // DELETE /calendar/transaction/:id - transactionni o'chirish
  deleteTransaction: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));
      if (!tokenData?.token?.access_token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.delete(
        `/calendar/transaction/${id}`,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to delete transaction" };
    }
  },
};
