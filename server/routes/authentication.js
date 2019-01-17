const express = require('express');

const router = express.Router();

const usersRoutes = require('../controllers/users');

const { userLogin, userSignup } = usersRoutes;

// Login Endpoint
router.post('/login', userLogin);

// Create a user record
router.post('/signup', userSignup);

// End Create a user record

module.exports = router;