import express from 'express';

import Users from '../controllers/users';

import Auth from '../middlewares/auth';

const { updateUser, deleteUser, userInformation } = Users;

const router = express.Router();

// Login Endpoint
router.put('/:id', Auth.verifyToken, updateUser);

// Delete user
router.delete('/:id', Auth.verifyToken, deleteUser);

// Fetch user information
router.get('/:id', Auth.verifyToken, userInformation);


export default router;
