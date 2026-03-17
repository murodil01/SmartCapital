import axiosInstance from "../axios";

export const goalsAPI = {
  // GET all goals - month required
  getAll: async (month) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      if (!month) {
        month = new Date().toISOString().slice(0, 7);
      }

      const url = `/goals?month=${month}`;
      console.log('Fetching goals from:', url);

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      console.log('Goals response:', response.data);
      
      const data = response.data;
      
      // Format goals for frontend
      const goals = [];
      
      // Add savings goal
      if (data.savings_target && parseFloat(data.savings_target) > 0) {
        goals.push({
          id: 'savings',
          name: 'Savings Goal',
          emoji: '🏦',
          current: parseFloat(data.savings_achieved || '0'),
          target: parseFloat(data.savings_target),
          color: '#2563eb',
          month: data.month,
          category: 'Savings',
          type: 'savings'
        });
      }

      // Add category goals
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach((cat, index) => {
          if (cat.target && parseFloat(cat.target) > 0) {
            goals.push({
              id: `cat_${index}_${Date.now()}`,
              name: cat.category,
              emoji: getCategoryEmoji(cat.category),
              current: parseFloat(cat.spent || '0'),
              target: parseFloat(cat.target),
              color: getCategoryColor(index),
              month: data.month,
              category: cat.category,
              type: 'category',
              exceeded: cat.exceeded || false
            });
          }
        });
      }

      return goals;
    } catch (error) {
      console.error('Get goals error:', error);
      return [];
    }
  },

  // POST create goal
  create: async (goalData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      // Format for backend
      const payload = {
        month: goalData.month || new Date().toISOString().slice(0, 7),
        savings_target: goalData.savings_target?.toString() || "0",
        categories: goalData.categories || []
      };

      console.log('Creating goal:', payload);

      const response = await axiosInstance.post('/goals', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create goal error:', error);
      throw error.response?.data || { error: 'Failed to create goal' };
    }
  },

  // PATCH update goal
  update: async (id, goalData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        month: goalData.month,
        savings_target: goalData.savings_target?.toString() || "0",
        categories: goalData.categories || []
      };

      const response = await axiosInstance.patch(`/goals/${id}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update goal error:', error);
      throw error.response?.data || { error: 'Failed to update goal' };
    }
  },

  // DELETE goal
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/goals/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete goal error:', error);
      throw error.response?.data || { error: 'Failed to delete goal' };
    }
  }
};

// Helper functions
const getCategoryEmoji = (category) => {
  if (!category) return '🎯';
  
  const emojiMap = {
    "Food": "🍔",
    "Transport": "🚗", 
    "Entertainment": "🎮",
    "Shopping": "🛒",
    "Bills": "📄",
    "Health": "💊",
    "Education": "🎓",
    "Travel": "✈️",
    "Savings": "🏦",
    "Family Vacation": "🏖️",
    "New Car": "🚗",
    "Home": "🏠",
    "Internet": "🌐",
    "Utilities": "💡",
    "Clothing": "👕",
    "Insurance": "🛡️",
    "Salary": "💰",
    "Rent": "🏠",
    "Groceries": "🛒",
    "Dining": "🍽️",
    "Coffee": "☕",
    "Gym": "🏋️",
    "Medical": "🏥",
    "Phone": "📱",
    "Subscription": "📺"
  };
  
  const lowerCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(emojiMap)) {
    if (key.toLowerCase() === lowerCategory) return value;
  }
  
  return "🎯";
};

const getCategoryColor = (index) => {
  const colors = ["#2563eb", "#d97706", "#7c3aed", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6", "#10b981"];
  return colors[index % colors.length];
};