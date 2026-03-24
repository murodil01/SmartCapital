import axiosInstance from "../axios";

// Katta sonlarni formatlash uchun yordamchi funksiya
const parseBigNumber = (numStr) => {
  if (!numStr) return 0;
  const cleanStr = numStr.toString().replace(/[^0-9.-]/g, "");
  return parseFloat(cleanStr) || 0;
};

// Tokenni olish uchun yordamchi funksiya (DRY prinsipi)
const getAuthHeaders = () => {
  const tokenData = JSON.parse(localStorage.getItem("tokenData"));
  if (!tokenData || !tokenData.token) return null;
  return {
    Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
  };
};

export const analyticsAPI = {
  // GET overview - umumiy statistika
  getOverview: async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error("No token found");

      const response = await axiosInstance.get("/analytics/overview", {
        headers,
      });
      const data = response.data;

      return {
        total_income: parseBigNumber(data.total_income),
        total_expense: parseBigNumber(data.total_expense),
        net: parseBigNumber(data.net),
        raw: data,
      };
    } catch {
      return { total_income: 0, total_expense: 0, net: 0, raw: null };
    }
  },

  // GET by-category - kategoriyalar bo'yicha
  getByCategory: async (kind = "expense") => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error("No token found");

      const validKind = ["income", "expense"].includes(kind) ? kind : "expense";
      const response = await axiosInstance.get(
        `/analytics/by-category?kind=${validKind}`,
        { headers },
      );

      if (!response.data || !response.data.items) return [];

      return response.data.items.map((item) => ({
        category: item.category || "Unknown",
        total: parseBigNumber(item.total),
      }));
    } catch {
      return [];
    }
  },

  // GET expense-vs-income-by-category
  getComparison: async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error("No token found");

      const response = await axiosInstance.get(
        "/analytics/expense-vs-income-by-category",
        { headers },
      );

      if (!response.data || !response.data.items) return [];

      return response.data.items.map((item) => ({
        category: item.category || "Unknown",
        income: parseBigNumber(item.income),
        expense: parseBigNumber(item.expense),
        net: parseBigNumber(item.net),
      }));
    } catch {
      return [];
    }
  },

  // GET timeline - vaqt bo'yicha ma'lumotlar
  getTimeline: async (kind = "all", granularity = "month") => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error("No token found");

      const validKind = ["income", "expense", "all"].includes(kind)
        ? kind
        : "all";
      const validGranularity = ["day", "week", "month", "year"].includes(
        granularity,
      )
        ? granularity
        : "month";

      const params = new URLSearchParams();
      if (validKind !== "all") params.append("kind", validKind);
      params.append("granularity", validGranularity);

      const response = await axiosInstance.get(
        `/analytics/timeline?${params.toString()}`,
        { headers },
      );

      if (!response.data) {
        return { kind: validKind, granularity: validGranularity, points: [] };
      }

      const points = (response.data.points || []).map((point) => ({
        bucket: point.bucket || "",
        total: parseBigNumber(point.total),
      }));

      return {
        kind: response.data.kind || validKind,
        granularity: response.data.granularity || validGranularity,
        points,
      };
    } catch {
      return { kind, granularity, points: [] };
    }
  },

  // GET calendar - kalendar ko'rinishi
  getCalendar: async (startDate, endDate) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error("No token found");

      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const url = `/analytics/calendar${params.toString() ? "?" + params.toString() : ""}`;
      const response = await axiosInstance.get(url, { headers });

      if (!Array.isArray(response.data)) return [];

      return response.data.map((day) => ({
        date: day.date || new Date().toISOString().split("T")[0],
        income: parseBigNumber(day.income),
        expense: parseBigNumber(day.expense),
        net: parseBigNumber(day.net),
      }));
    } catch {
      return [];
    }
  },
};
