import express from 'express';

import Users from '../controllers/users';

const { updateUser, deleteUser, userInformation } = Users;

const router = express.Router();

// Login Endpoint
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Fetch user information
router.get('/:id', userInformation);


export default router;
