const express = require('express');
const database = require('../db_queries/users');

const router = express.Router();

const { users } = database;
const { validateLogin } = database;


router.post('/login', (req, res) => {
    // Validate Data
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).send({
            status: 400,
            error: error.details[0].message
        });
    }
    const user = users.find(u => (u.username === req.body.username)
    && (u.password === req.body.password));
    if (!user) {
        return res.status(404).send({
            status: 404,
            error: 'Invalid credentials'
        });
    }
    const response = {
        status: 200,
        data: [{
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            othername: user.othername
        }]
    };
    return res.send(response);
});

module.exports = router;