import express from 'express'

import * as userController from '../controllers/userController.js'

export const userRoutes = express.Router();

userRoutes.post('/', userController.createUser);
userRoutes.get('/', userController.getAllUsers);
userRoutes.get('/:id', userController.getUserById);
userRoutes.put('/:id', userController.updateUser);
userRoutes.delete('/:id', userController.deleteUser);
