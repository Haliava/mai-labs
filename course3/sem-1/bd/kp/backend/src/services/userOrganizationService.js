export const addUserToOrganization = async (userOrganizationRepository, { userId, organizationId }) => {
  if (!userId || !organizationId) {
      throw new Error('userId and organizationId are required');
  }
  return await userOrganizationRepository.addUserToOrganization(userId, organizationId);
};

export const getOrganizationsByUser = async (userOrganizationRepository, userId) => {
  if (!userId) {
      throw new Error('userId is required');
  }
  return await userOrganizationRepository.findOrganizationsByUser(userId);
};

export const getUsersByOrganization = async (userOrganizationRepository, organizationId) => {
  if (!organizationId) {
      throw new Error('organizationId is required');
  }
  return await userOrganizationRepository.findUsersByOrganization(organizationId);
};

export const removeUserFromOrganization = async (userOrganizationRepository, { userId, organizationId }) => {
  if (!userId || !organizationId) {
      throw new Error('userId and organizationId are required');
  }
  const result = await userOrganizationRepository.removeUserFromOrganization(userId, organizationId);
  if (!result) {
      throw new Error('Relationship not found');
  }
  return result;
};
