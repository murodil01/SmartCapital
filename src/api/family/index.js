import axiosInstance from "../axios";

// Family role va status enum larini mapping qilish
export const FamilyRole = {
  OWNER: "OWNER",
  PARTNER: "PARTNER",
  CHILD: "CHILD",
  MEMBER: "MEMBER"
};

export const FamilyStatus = {
  ACTIVE: "ACTIVE",
  INVITED: "INVITED",
  INACTIVE: "INACTIVE"
};

// Frontend role formatidan backend formatiga
const mapRoleToBackend = (role) => {
  switch(role) {
    case 'admin': return FamilyRole.OWNER;
    case 'member': return FamilyRole.MEMBER;
    case 'child': return FamilyRole.CHILD;
    case 'partner': return FamilyRole.PARTNER;
    default: return FamilyRole.MEMBER;
  }
};

// Backend role formatidan frontend formatiga
const mapRoleToFrontend = (role) => {
  switch(role) {
    case FamilyRole.OWNER: return 'admin';
    case FamilyRole.MEMBER: return 'member';
    case FamilyRole.CHILD: return 'child';
    case FamilyRole.PARTNER: return 'member';
    default: return 'member';
  }
};

// Status formatlash
const mapStatusToFrontend = (status) => {
  switch(status) {
    case FamilyStatus.ACTIVE: return 'Active';
    case FamilyStatus.INVITED: return 'Invited';
    case FamilyStatus.INACTIVE: return 'Inactive';
    default: return 'Active';
  }
};

const mapStatusToBackend = (status) => {
  if (status === 'Active') return FamilyStatus.ACTIVE;
  if (status === 'Invited') return FamilyStatus.INVITED;
  if (status === 'Inactive') return FamilyStatus.INACTIVE;
  return FamilyStatus.ACTIVE;
};

export const familyAPI = {
  // GET all family members
  getAll: async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.get('/family/members', {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      // Format each member
      return (response.data || []).map(member => ({
        id: member.id,
        name: member.name || '',
        email: member.email || '',
        role: mapRoleToFrontend(member.role),
        status: mapStatusToFrontend(member.status),
        joined_at: member.joined_at || new Date().toISOString().slice(0, 10),
        // Balance field qo'shimcha - backenddan kelmasa 0
        balance: 0
      }));
    } catch (error) {
      console.error('Get family members error:', error);
      throw error;
    }
  },

  // POST create family member
  create: async (memberData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        name: memberData.name,
        email: memberData.email,
        role: mapRoleToBackend(memberData.role),
        status: memberData.status === 'Invited' ? FamilyStatus.INVITED : FamilyStatus.ACTIVE
      };

      const response = await axiosInstance.post('/family/members', payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create family member error:', error);
      throw error.response?.data || { error: 'Failed to create family member' };
    }
  },

  // PATCH update family member
  update: async (id, memberData) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const payload = {
        name: memberData.name,
        email: memberData.email,
        role: mapRoleToBackend(memberData.role),
        status: mapStatusToBackend(memberData.status)
      };

      const response = await axiosInstance.patch(`/family/members/${id}`, payload, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update family member error:', error);
      throw error.response?.data || { error: 'Failed to update family member' };
    }
  },

  // DELETE family member
  delete: async (id) => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('tokenData'));
      if (!tokenData) throw { error: 'No token found' };

      const response = await axiosInstance.delete(`/family/members/${id}`, {
        headers: {
          Authorization: `${tokenData.token.token_type} ${tokenData.token.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Delete family member error:', error);
      throw error.response?.data || { error: 'Failed to delete family member' };
    }
  }
};