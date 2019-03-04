
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const validator = (identifier, data) => {
    let schema = false;
    const options = {
        allowUnknown: true,
        abortEarly: false,
    };
    switch (identifier) {
        case 'meetup': {
            schema = {
                location: Joi.string().trim().min(5).required(),
                images: Joi.array().required(),
                topic: Joi.string().trim().min(5).required(),
                description: Joi.string().trim().required(),
                happeningon: Joi.date().required(),
                tags: Joi.array(),
            };
            break;
        }
        case 'rsvps': {
            schema = {
                response: Joi.string().trim().required().valid(['yes', 'no', 'maybe']),
            };
            break;
        }
        case 'question': {
            schema = {
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required(),
            };
            break;
        }
        case 'user': {
            schema = {
                firstname: Joi.string().trim().min(3).required(),
                lastname: Joi.string().trim().min(3).required(),
                othername: Joi.string().trim(),
                email: Joi.string().trim().email({
                    minDomainAtoms: 2,
                }).required(),
                phonenumber: Joi.number().required(),
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required(),
                registered: Joi.date(),
                isadmin: Joi.boolean().required(),
            };
            break;
        }
        case 'login': {
            schema = {
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required(),
            };
            break;
        }
        case 'addMeetupImages': {
            schema = {
                images: Joi.array().required(),
            };
            break;
        }
        case 'removeMeetupImages': {
            schema = {
                images: Joi.string().trim().required(),
            };
            break;
        }
        case 'addMeetupTags': {
            schema = {
                tags: Joi.array().required(),
            };
            break;
        }
        case 'removeMeetupTags': {
            schema = {
                tags: Joi.string().trim().required(),
            };
            break;
        }
        case 'comment': {
            schema = {
                comment: Joi.string().trim().min(3).required(),
            };
            break;
        }
        case 'updateComment': {
            schema = {
                comment: Joi.string().trim().min(3).required(),
            };
            break;
        }
        case 'updateMeetup': {
            schema = {
                location: Joi.string().trim().min(5).required(),
                topic: Joi.string().trim().min(5).required(),
                description: Joi.string().trim().required(),
                happeningon: Joi.date().required(),
            };
            break;
        }
        case 'updateQuestion': {
            schema = {
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required(),
            };
            break;
        }
        case 'updateUser': {
            schema = {
                firstname: Joi.string().trim().min(3).required(),
                lastname: Joi.string().trim().min(3).required(),
                othername: Joi.string().trim(),
                email: Joi.string().trim().email({
                    minDomainAtoms: 2,
                }).required(),
                phonenumber: Joi.number().required(),
                username: Joi.string().trim().min(5).required(),
                isadmin: Joi.boolean().required(),
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
        error: errorMessage,
    });
};

const hashPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return hashedPassword;
};

const comparePassword = (passwordHash, password) => {
    const comparedPassword = bcrypt.compareSync(password, passwordHash);
    return comparedPassword;
};

const generateToken = (userinfo) => {
    const Issuetoken = jwt.sign(userinfo,
        process.env.SECRET, { expiresIn: '1d' });
    return Issuetoken;
};

const popularTags = (tags) => {
    const popularTagsList = [];
    const popularTagsOccurency = [];
    tags.forEach((tag) => {
        if (!(popularTagsList.includes(tag))) {
            popularTagsList.push(tag);
            popularTagsOccurency.push(tagOccurency(tags, tag));
        }
    });

    const processedPopular = [];
    for (let count = 0; count < popularTagsList.length; count += 1) {
        const tagProcessed = {
            tags: popularTagsList[count],
            occurency: popularTagsOccurency[count],
        };
        processedPopular.push(tagProcessed);
    }

    processedPopular.sort((a, b) => {
        const occurency1 = a.occurency;
        const occurency2 = b.occurency;
        return occurency1 < occurency2 ? 1 : -1;
    });

    return processedPopular;
};

const tagOccurency = (tags, tag) => {
    let counter = 0;
    tags.forEach((singletag) => {
        if (singletag === tag) {
            counter += 1;
        }
    });
    return counter;
};

export {
    validator,
    validationErrors,
    hashPassword,
    comparePassword,
    generateToken,
    popularTags,
};
