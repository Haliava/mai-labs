import { accessControlRepository } from '../repository/access_controls.js';
import {
  createAccessControl as createAccessControlService,
  deleteAccessControl as deleteAccessControlService,
  getAccessControlById as getAccessControlByIdService,
  getAllAccessControls as getAllAccessControlsService,
  updateAccessControl as updateAccessControlService,
} from '../services/accessControlsService.js';

export const createAccessControl = async (req, res) => {
    try {
        const newAccess = await createAccessControlService(accessControlRepository, req.body);
        res.status(201).json(newAccess);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllAccessControls = async (req, res) => {
    try {
        const accessControls = await getAllAccessControlsService(accessControlRepository);
        res.status(200).json(accessControls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAccessControlById = async (req, res) => {
    try {
        const accessControl = await getAccessControlByIdService(accessControlRepository, req.params.id);
        if (!accessControl) {
            return res.status(404).json({ message: 'Access control not found' });
        }
        res.status(200).json(accessControl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAccessControl = async (req, res) => {
    try {
        const updatedAccess = await updateAccessControlService(accessControlRepository, req.params.id, req.body);
        if (!updatedAccess) {
            return res.status(404).json({ message: 'Access control not found' });
        }
        res.status(200).json(updatedAccess);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAccessControl = async (req, res) => {
    try {
        const deletedAccess = await deleteAccessControlService(accessControlRepository, req.params.id);
        if (!deletedAccess) {
            return res.status(404).json({ message: 'Access control not found' });
        }
        res.status(200).json(deletedAccess);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
