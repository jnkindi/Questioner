import express from 'express';

import Users from '../controllers/users';

const {
    userLogin, userSignup, userRecoverPassword, checkPasswordResetHash, resetPasswordByHash, resetPasswordByAccessCode,
} = Users;

const router = express.Router();

// Login Endpoint
router.post('/login', userLogin);

// Create a user record
router.post('/signup', userSignup);

// Recover password
router.post('/recover', userRecoverPassword);

// Check recovery hash
router.get('/reset/:hash', checkPasswordResetHash);

// Reset password with access code
router.post('/reset', resetPasswordByAccessCode);

// Reset password with hash
router.post('/reset/:hash', resetPasswordByHash);

export default router;
