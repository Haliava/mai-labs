import express from 'express'

import * as organizationSettingsController from '../controllers/organizationSettingsController.js'

export const orgSettingsRoutes = express.Router();

orgSettingsRoutes.post('/', organizationSettingsController.createOrganizationSetting);
orgSettingsRoutes.get('/:id', organizationSettingsController.getOrganizationSettingById);
orgSettingsRoutes.get('/organization/:organizationId', organizationSettingsController.getAllOrganizationSettings);
orgSettingsRoutes.put('/:id', organizationSettingsController.updateOrganizationSetting);
orgSettingsRoutes.delete('/:id', organizationSettingsController.deleteOrganizationSetting);
