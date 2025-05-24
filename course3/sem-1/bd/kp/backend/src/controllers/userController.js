
import { userRepository } from '../repository/user.js'
import {
  createUser as createUserRoute,
  deleteUser as deleteUserRoute,
  getAllUsers as getAllUsersRoute,
  getUserById as getUserByIdRoute,
  updateUser as updateUserRoute,
} from '../services/userService.js'

export const createUser = async (req, res) => {
    try {
        const newUser = await createUserRoute(userRepository, req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersRoute(userRepository);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdRoute(userRepository, req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await updateUserRoute(userRepository, req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await deleteUserRoute(userRepository, req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
