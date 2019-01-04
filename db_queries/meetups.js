const Joi = require('joi');
let fs = require('fs');

let meetupsFetched = [];
try{
    meetupsFetched = require('../db/meetups.json');
} catch(err){
    meetupsFetched = [];
}

if(typeof(meetupsFetched) !== 'object'){
    meetupsFetched = [];
}

module.exports = {
    meetups: meetupsFetched,
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
        // End Create an ​ meetup​​ record
    },
    recordMeetup: (data) => {
        fs.writeFile('./db/meetups.json', JSON.stringify(data, null, 2), (err) => {
            if (err) return response = {"status":500,"error":err};
        });
        return true;
    }
};