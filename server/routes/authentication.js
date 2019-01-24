import express from 'express';

import Users from '../controllers/users';

const { userLogin, userSignup } = Users;

const router = express.Router();

// Login Endpoint
router.post('/login', userLogin);

// Create a user record
router.post('/signup', userSignup);

// End Create a user record

export default router;
