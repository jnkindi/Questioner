const express = require('express');
let fs = require('fs');
const database = require('../db_queries/meetups');

const router = express.Router();

let {meetups} = database;
const {validateMeetup} = database;
const {recordMeetup} = database;


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


module.exports = router;