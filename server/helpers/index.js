
import Joi from 'joi';

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
                happeningon: Joi.date().required(),
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
                createdby: Joi.number().required(),
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required()
            };
            break;
        }
        case 'user': {
            schema = {
                firstname: Joi.string().trim().min(3).required(),
                lastname: Joi.string().trim().min(3).required(),
                othername: Joi.string().trim(),
                email: Joi.string().trim().email({
                    minDomainAtoms: 2
                }).required(),
                phonenumber: Joi.number().required(),
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required(),
                registered: Joi.date(),
                isadmin: Joi.boolean().required()
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

const validationErrors = (res, error) => {
    const errorMessage = error.details.map(d => d.message);
    return res.status(400).send({
        status: 400,
        error: errorMessage
    });
};

export {
    validator,
    validationErrors
};