export const createOrganization = async (repository, data) => {
  return await repository.create(data);
}

export const getAllOrganizations = async (repository, data) => {
  return await repository.findAll(data);
}

export const getOrganizationById = async (organizationRepository, id) => {
  return await organizationRepository.findById(id);
}

export const updateOrganization = async (organizationRepository, id, organizationData) => {
  return await organizationRepository.update(id, organizationData);
}

export const deleteOrganization = async (organizationRepository, id) => {
  return await organizationRepository.delete(id);
};
