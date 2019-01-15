const Joi = require('joi');
const fs = require('fs');

let rsvpsFetched = [];
let meetupsFetched = [];
try {
    meetupsFetched = require('../data/meetups.json');
} catch (err) {
    meetupsFetched = [];
}

if (typeof (meetupsFetched) !== 'object') {
    meetupsFetched = [];
}

try {
    rsvpsFetched = require('../data/rsvps.json');
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
            location: Joi.string().min(5).required(),
            images: Joi.array().required(),
            topic: Joi.string().min(5).required(),
            description: Joi.string().required(),
            happeningOn: Joi.date().required(),
            tags: Joi.array()
        };
        return Joi.validate(meetup, schema);
        // End Create an meetup record
    },
    recordMeetup: (data) => {
        fs.writeFile('./server/data/meetups.json', JSON.stringify(data, null, 2), (err) => {
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
            response: Joi.string().required()
        };
        return Joi.validate(rsvp, schema);
    },
    recordRsvp: (data) => {
        fs.writeFile('./server/data/rsvps.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
        });
        return true;
    }
};