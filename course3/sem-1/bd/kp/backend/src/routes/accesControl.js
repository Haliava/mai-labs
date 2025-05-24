import express from 'express'

import * as accessControlController from '../controllers/accessControlController.js'

export const accessControlRoutes = express.Router();

accessControlRoutes.post('/', accessControlController.createAccessControl);
accessControlRoutes.get('/', accessControlController.getAllAccessControls);
accessControlRoutes.get('/:id', accessControlController.getAccessControlById);
accessControlRoutes.put('/:id', accessControlController.updateAccessControl);
accessControlRoutes.delete('/:id', accessControlController.deleteAccessControl);
