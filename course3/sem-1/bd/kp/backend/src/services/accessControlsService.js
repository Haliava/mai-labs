export const createAccessControl = async (accessControlRepository, accessControlData) => {
  const { userId, organizationId, permissions } = accessControlData;

  const existingAccess = await accessControlRepository.findByUser(userId, organizationId);
  if (existingAccess) {
      throw new Error('Access control for this user and organization already exists.');
  }

  return await accessControlRepository.create({ userId, organizationId, permissions });
};

export const getAllAccessControls = async (accessControlRepository) => {
  return await accessControlRepository.findAll();
};

export const getAccessControlById = async (accessControlRepository, id) => {
  return await accessControlRepository.findById(id);
};

export const updateAccessControl = async (accessControlRepository, id, updatedData) => {
  return await accessControlRepository.update(id, updatedData);
};

export const deleteAccessControl = async (accessControlRepository, id) => {
  return await accessControlRepository.delete(id);
};
