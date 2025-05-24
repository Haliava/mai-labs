import { organizationRepository } from '../repository/organization.js';
import {
  createOrganization as createOrganizationService,
  deleteOrganization as deleteOrganizationService,
  getAllOrganizations as getAllOrganizationsService,
  getOrganizationById as getOrganizationByIdService,
  updateOrganization as updateOrganizationService,
} from '../services/organizationService.js';

export const createOrganization = async (req, res) => {
    try {
        const newOrg = await createOrganizationService(organizationRepository, req.body);
        res.status(201).json(newOrg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await getAllOrganizationsService(organizationRepository);
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const organization = await getOrganizationByIdService(organizationRepository, req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrganization = async (req, res) => {
    try {
        const updatedOrg = await updateOrganizationService(organizationRepository, req.params.id, req.body);
        if (!updatedOrg) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json(updatedOrg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        console.log(req.params)
        const deletedOrg = await deleteOrganizationService(organizationRepository, req.params.id);
        if (!deletedOrg) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json(deletedOrg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
