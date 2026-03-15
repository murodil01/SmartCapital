import axiosInstance from "../axios";

export const settingsAPI = {
  // GET profile
  getProfile: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));

      if (!tokenData) throw { error: "No token found" };

      const response = await axiosInstance.get("/settings/profile", {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch profile" };
    }
  },

  // PATCH profile
  updateProfile: async (profileData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));

      if (!tokenData) throw { error: "No token found" };

      const response = await axiosInstance.patch(
        "/settings/profile",
        profileData,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update profile" };
    }
  },

  // PATCH password
  changePassword: async (passwordData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("tokenData"));

      if (!tokenData) throw { error: "No token found" };

      const response = await axiosInstance.patch(
        "/settings/password",
        passwordData,
        {
          headers: {
            Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to change password" };
    }
  },
};
