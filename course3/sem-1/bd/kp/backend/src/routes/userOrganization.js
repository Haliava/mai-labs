import express from 'express'

import * as userOrganizationController from '../controllers/userOrganizationController.js'

export const userOrganizationRoutes = express.Router();

userOrganizationRoutes.post('/', userOrganizationController.addUserToOrganization);
userOrganizationRoutes.delete('/', userOrganizationController.removeUserFromOrganization);
userOrganizationRoutes.get('/user/:userId', userOrganizationController.getOrganizationsByUser);
userOrganizationRoutes.get('/organization/:organizationId', userOrganizationController.getUsersByOrganization);
