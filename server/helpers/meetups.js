const Joi = require('joi');
const fs = require('fs');

let rsvpsFetched = [];
let meetupsFetched = [];
try {
    meetupsFetched = require('../models/meetups.json');
} catch (err) {
    meetupsFetched = [];
}

if (typeof (meetupsFetched) !== 'object') {
    meetupsFetched = [];
}

try {
    rsvpsFetched = require('../models/rsvps.json');
} catch (err) {
    rsvpsFetched = [];
}

if (typeof (rsvpsFetched) !== 'object') {
    rsvpsFetched = [];
}

module.exports = {
    meetups: meetupsFetched,
    rsvps: rsvpsFetched,
    validateMeetup: (meetup) => {
        // Validation F(x) for Meetup
        const schema = {
            location: Joi.string().trim().min(5).required(),
            images: Joi.array().required(),
            topic: Joi.string().trim().min(5).required(),
            description: Joi.string().trim().required(),
            happeningOn: Joi.date().required(),
            tags: Joi.array()
        };
        const options = {
            allowUnknown: true,
            abortEarly: false
        };
        return Joi.validate(meetup, schema, options);
        // End Create an meetup record
    },
    recordMeetup: (data) => {
        fs.writeFile('./server/models/meetups.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return {
                    status: 500,
                    error: err
                };
            }
            return true;
        });
        return true;
    },
    validateRsvp: (rsvp) => {
        // Validation F(x) for Rsvp
        const schema = {
            meetup: Joi.number().required(),
            user: Joi.number().required(),
            response: Joi.string().trim().required().valid(['yes', 'no', 'maybe'])
        };
        const options = {
            allowUnknown: true,
            abortEarly: false
        };
        return Joi.validate(rsvp, schema, options);
    },
    recordRsvp: (data) => {
        fs.writeFile('./server/models/rsvps.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
        });
        return true;
    }
};