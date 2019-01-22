const Joi = require('joi');
const fs = require('fs');

const meetupsHelpers = require('./meetups');
const questionsHelpers = require('./questions');
const usersHelpers = require('./users');

const validator = (identifier, data) => {
    let schema = false;
    const options = {
        allowUnknown: true,
        abortEarly: false
    };
    switch (identifier) {
        case 'meetup': {
            schema = {
                location: Joi.string().trim().min(5).required(),
                images: Joi.array().required(),
                topic: Joi.string().trim().min(5).required(),
                description: Joi.string().trim().required(),
                happeningOn: Joi.date().required(),
                tags: Joi.array()
            };
            break;
        }
        case 'rsvps': {
            schema = {
                user: Joi.number().required(),
                response: Joi.string().trim().required().valid(['yes', 'no', 'maybe'])
            };
            break;
        }
        case 'question': {
            schema = {
                createdBy: Joi.number().required(),
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required()
            };
            break;
        }
        case 'user': {
            schema = {
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
            break;
        }
        case 'login': {
            schema = {
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required()
            };
            break;
        }
        default: {
            schema = false;
        }
    }
    return Joi.validate(data, schema, options);
};

const writeInFile = (file, data) => {
    fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return {
                status: 500,
                error: err
            };
        }
        return true;
    });
    return true;
};

const writeInDb = (identifier, data) => {
    let file = '';
    switch (identifier) {
        case 'meetup': {
            file = './server/models/meetups.json';
            break;
        }
        case 'rsvps': {
            file = './server/models/rsvps.json';
            break;
        }
        case 'question': {
            file = './server/models/questions.json';
            break;
        }
        case 'user': {
            file = './server/models/questions.json';
            break;
        }
        default: {
            file = 'unknown.json';
        }
    }
    return writeInFile(file, data);
};

const validationErrors = (res, error) => {
    const errorMessage = error.details.map(d => d.message);
    return res.status(400).send({
        status: 400,
        error: errorMessage
    });
};

module.exports = {
    meetupsHelpers,
    questionsHelpers,
    usersHelpers,
    validator,
    writeInDb,
    validationErrors
};