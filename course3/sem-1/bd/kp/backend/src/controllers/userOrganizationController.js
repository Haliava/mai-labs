
import { userOrganizationRepository } from '../repository/user_organization.js'
import {
  addUserToOrganization as addUserToOrganizationService,
  getOrganizationsByUser as getOrganizationsByUserService,
  getUsersByOrganization as getUsersByOrganizationService,
  removeUserFromOrganization as removeUserFromOrganizationService,
} from '../services/userOrganizationService.js'

export const addUserToOrganization = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, organizationId } = req.body;
        const result = await addUserToOrganizationService(userOrganizationRepository, { userId, organizationId });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const removeUserFromOrganization = async (req, res) => {
    try {
        const { userId, organizationId } = req.body;
        const result = await removeUserFromOrganizationService(userOrganizationRepository, { userId, organizationId });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getOrganizationsByUser = async (req, res) => {
    try {
        const organizations = await getOrganizationsByUserService(userOrganizationRepository, req.params.userId);
        res.status(200).json(organizations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getUsersByOrganization = async (req, res) => {
    try {
        const users = await getUsersByOrganizationService(userOrganizationRepository, req.params.organizationId);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
