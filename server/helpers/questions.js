const Joi = require('joi');
const fs = require('fs');

let questionsFetched = [];
try {
    questionsFetched = require('../models/questions.json');
} catch (err) {
    questionsFetched = [];
}

if (typeof (questionsFetched) !== 'object') {
    questionsFetched = [];
}

module.exports = {
    questions: questionsFetched,
    validateQuestion: (question) => {
        // Validation F(x) for Question
        const schema = {
            createdBy: Joi.number().required(),
            title: Joi.string().trim().min(5).required(),
            body: Joi.string().trim().min(10).required()
        };
        const options = {
            allowUnknown: true,
            abortEarly: false
        };
        return Joi.validate(question, schema, options);
    },
    recordQuestion: (data) => {
        fs.writeFile('./server/models/questions.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
        });
        return true;
    }
};