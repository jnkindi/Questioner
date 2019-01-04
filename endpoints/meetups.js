const express = require('express');
const database = require('../db_queries/meetups');

const router = express.Router();

let {meetups} = database;
const {validateMeetup} = database;
const {recordMeetup} = database;

let {rsvps} = database;
const {validateRsvp} = database;
const {recordRsvp} = database;


// Create an ​ meetup​​ record
router.post('/', (req, res) => {
    // Validate Data
    const { error } = validateMeetup(req.body);
    if(error) return res.status(400).send({ "status":400, "error":error.details[0].message});
    const meetup = {
        id: meetups.length +1,
        createdOn: new Date().toISOString().replace('T', ' ').replace(/\..*$/, ''),
        location: req.body.location,
        images: req.body.images,
        topic: req.body.topic,
        description: req.body.description,
        happeningOn: req.body.happeningOn,
        tags: req.body.tags,
    };

    meetups.push(meetup);
    if(recordMeetup(meetups)){
        const response = {
            "status" : 200,
            "data" : [{
                "topic": req.body.topic,
                "description": req.body.description,
                "location": req.body.location,
                "happeningOn": req.body.happeningOn,
                "tags": req.body.tags
            }]
        };
        res.send(response);
    }
});

// End Create an ​ meetup​​ record

// Fetch all ​ meetup​​ records.

router.get('/', (req, res)=> {
    let data = [];
    meetups.forEach( (meetup) => {
        delete meetup['createdOn'];
        delete meetup['images'];
        data.push(meetup);
    });
    let response = {
        "status" : 200,
        "data" : data
    };
    res.send(response);
});

// End Fetch all ​ meetup​​ records.

// Fetch all ​ upcoming​​ ​ meetup​​ records.

router.get('/upcoming/', (req, res)=> {
    //Sort by date in ascending order for getting upcoming
    meetups.sort((a,b) => {
        return new Date(a.happeningOn) - new Date(b.happeningOn);
    });

    
    let data = [];
    let count = 0;
    meetups.forEach( (meetup) => {
        // Limiting 5 upcoming meetup
        if(count <= 5 && new Date(meetup.happeningOn) >= new Date()) {
            delete meetup['createdOn'];
            delete meetup['images'];
            data.push(meetup);
            count ++;
        }
    });
    let response = {
        "status" : 200,
        "data" : data
    };
    res.send(response);
});

// Fetch all ​ upcoming​​ ​ meetup​​ records.

// Fetch a specific ​ meetup​​ record.

router.get('/:id', (req, res)=> {
    const meetup = meetups.find(m => m.id === parseInt(req.params.id));
    if(!meetup) return res.status(404).send({ "status":404, "error":"Meetup with given ID was not found"});
    let response = {
        "status" : 200,
        "data" : [{
            "id": meetup.id,
            "topic": meetup.topic,
            "description": meetup.description,
            "location": meetup.location,
            "happeningOn": meetup.happeningOn,
            "tags": meetup.tags
        }]
    };
    res.send(response);
});

// End Fetch a specific ​ meetup​​ record.

// Respond to meetup RSVP.
router.post('/:id/rsvps', (req, res) => {
    // Validate Data
    const { error } = validateRsvp(req.body);
    if(error) return res.status(400).send({ "status":400, "error":error.details[0].message});

    const meetup = meetups.find(m => m.id === parseInt(req.params.id));
    if(!meetup) return res.status(404).send({ "status":404, "error":"Meetup with given ID was not found"});
    const {topic} = meetups.find(m => m.id === parseInt(req.params.id));

    const rsvp = {
        id: rsvps.length +1,
        meetup: req.params.id,
        user: req.body.user,
        response: req.body.response,
    };

    rsvps.push(rsvp);

    if(recordRsvp(rsvps)){
        const response = {
            "status" : 200,
            "data" : [{
                "meetup": req.body.meetup,
                "topic": topic,
                "status": req.body.response,
            }]
        };
        res.send(response);
    }
});

// End Respond to meetup RSVP.


module.exports = router;