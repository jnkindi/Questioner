import express from 'express';

import Users from '../controllers/users';

const { updateUser } = Users;

const router = express.Router();

// Login Endpoint
router.put('/:id', updateUser);


export default router;