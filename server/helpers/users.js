const Joi = require('joi');
const fs = require('fs');

let usersFetched = [];
try {
    usersFetched = require('../models/users.json');
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
            firstname: Joi.string().trim().min(5).required(),
            lastname: Joi.string().trim().min(5).required(),
            othername: Joi.string().trim(),
            email: Joi.string().trim().email({
                minDomainAtoms: 2
            }).required(),
            phoneNumber: Joi.number().required(),
            username: Joi.string().trim().min(5).required(),
            password: Joi.string().trim().min(8).required(),
            registered: Joi.date(),
            isAdmin: Joi.boolean().required()
        };
        const options = {
            allowUnknown: true,
            abortEarly: false
        };
        return Joi.validate(user, schema, options);
        // End Create an user record
    },
    validateLogin: (access) => {
        // Validation F(x) for login
        const schema = {
            username: Joi.string().trim().min(5).required(),
            password: Joi.string().trim().min(8).required()
        };
        const options = {
            allowUnknown: true,
            abortEarly: false
        };
        return Joi.validate(access, schema, options);
        // End validation F(x) for login
    },
    recordUser: (data) => {
        fs.writeFile('./server/models/users.json', JSON.stringify(data, null, 2), (err) => {
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