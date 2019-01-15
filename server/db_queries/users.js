const Joi = require('joi');
const fs = require('fs');

let usersFetched = [];
try {
    usersFetched = require('../db/users.json');
} catch (err) {
    usersFetched = [];
}

if (typeof (usersFetched) !== 'object') {
    usersFetched = [];
}

module.exports = {
    users: usersFetched,
    validateUser: (user) => {
        // Validation F(x) for User
        const schema = {
            firstname: Joi.string().min(5).required(),
            lastname: Joi.string().min(5).required(),
            othername: Joi.string(),
            email: Joi.string().email({
                minDomainAtoms: 2
            }).required(),
            phoneNumber: Joi.number().required(),
            username: Joi.string().min(5).required(),
            password: Joi.string().min(8).required(),
            registered: Joi.date(),
            isAdmin: Joi.boolean().required()
        };
        return Joi.validate(user, schema);
        // End Create an user record
    },
    validateLogin: (access) => {
        // Validation F(x) for login
        const schema = {
            username: Joi.string().min(5).required(),
            password: Joi.string().min(8).required()
        };
        return Joi.validate(access, schema);
        // End validation F(x) for login
    },
    recordUser: (data) => {
        fs.writeFile('./server/db/users.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return {
                    status: 500,
                    error: err
                };
            }
            return true;
        });
        return true;
    }
};