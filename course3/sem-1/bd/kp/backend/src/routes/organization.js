import express from 'express'

import * as organizationController from '../controllers/organizationController.js'

export const orgRoutes = express.Router();

orgRoutes.post('/', organizationController.createOrganization);
orgRoutes.get('/', organizationController.getAllOrganizations);
orgRoutes.get('/:id', organizationController.getOrganizationById);
orgRoutes.put('/:id', organizationController.updateOrganization);
orgRoutes.delete('/:id', organizationController.deleteOrganization);
