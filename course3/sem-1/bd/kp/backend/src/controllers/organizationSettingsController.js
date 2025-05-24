import { organizationSettingsRepository } from '../repository/organization_settings.js';
import {
  createOrganizationSetting as createOrganizationSettingService,
  deleteOrganizationSetting as deleteOrganizationSettingService,
  getAllOrganizationSettings as getAllOrganizationSettingsService,
  getOrganizationSettingById as getOrganizationSettingByIdService,
  updateOrganizationSetting as updateOrganizationSettingService,
} from '../services/organizationSettingsService.js';

export const createOrganizationSetting = async (req, res) => {
    try {
        const { organizationId, settingKey, settingValue } = req.body;
        const newSetting = await createOrganizationSettingService(organizationSettingsRepository, { organizationId, settingKey, settingValue });
        res.status(201).json(newSetting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getOrganizationSettingById = async (req, res) => {
    try {
        const setting = await getOrganizationSettingByIdService(organizationSettingsRepository, req.params.id);
        res.status(200).json(setting);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getAllOrganizationSettings = async (req, res) => {
    try {
        const settings = await getAllOrganizationSettingsService(organizationSettingsRepository, req.params.organizationId);
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrganizationSetting = async (req, res) => {
    try {
        const updatedSetting = await updateOrganizationSettingService(organizationSettingsRepository, req.params.id, req.body);
        res.status(200).json(updatedSetting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteOrganizationSetting = async (req, res) => {
    try {
        const deletedSetting = await deleteOrganizationSettingService(organizationSettingsRepository, req.params.id);
        res.status(200).json(deletedSetting);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
