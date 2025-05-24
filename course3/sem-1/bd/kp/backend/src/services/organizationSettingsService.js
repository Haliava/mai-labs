export const createOrganizationSetting = async (organizationSettingsRepository, { organizationId, settingKey, settingValue }) => {
  if (!organizationId || !settingKey || !settingValue) {
      throw new Error('Missing required fields: organizationId, settingKey, or settingValue');
  }

  return await organizationSettingsRepository.create({ organizationId, settingKey, settingValue });
};

export const getOrganizationSettingById = async (organizationSettingsRepository, id) => {
  const setting = await organizationSettingsRepository.findById(id);
  if (!setting) {
      throw new Error('Organization setting not found');
  }
  return setting;
};

export const getAllOrganizationSettings = async (organizationSettingsRepository, organizationId) => {
  return await organizationSettingsRepository.findAllByOrganizationId(organizationId);
};

export const updateOrganizationSetting = async (organizationSettingsRepository, id, updatedData) => {
  const updatedSetting = await organizationSettingsRepository.update(id, updatedData);
  if (!updatedSetting) {
      throw new Error('Organization setting not found');
  }
  return updatedSetting;
};

export const deleteOrganizationSetting = async (organizationSettingsRepository, id) => {
  const deletedSetting = await organizationSettingsRepository.delete(id);
  if (!deletedSetting) {
      throw new Error('Organization setting not found');
  }
  return deletedSetting;
};
