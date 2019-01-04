const express = require('express');
let fs = require('fs');
const database = require('../db_queries/questions');

const router = express.Router();

let {questions} = database;
const {validateQuestion} = database;
const {recordQuestion} = database;


// Create a question for a specific meetup.
router.post('/', (req, res) => {
    // Validate Data
    const { error } = validateQuestion(req.body);
    if(error) return res.status(400).send({ "status":400, "error":error.details[0].message});
    const question = {
        id: questions.length +1,
        createdOn: new Date().toISOString().replace('T', ' ').replace(/\..*$/, ''),
        createdBy: req.body.createdBy,
        meetup: req.body.meetup,
        title: req.body.title,
        body: req.body.body,
        votes: 0
    };

    questions.push(question);

    if(recordQuestion(questions)){
        const response = {
            "status" : 200,
            "data" : [{
                "user": req.body.createdBy,
                "meetup": req.body.meetup,
                "title": req.body.title,
                "body": req.body.body
            }]
        };
        res.send(response);
    }
});

// End Create a question for a specific meetup.


// Upvote (increase votes by 1) a specific question.

router.patch('/:id/upvote', (req, res)=> {
    const arrIndex = questions.findIndex(q => q.id === parseInt(req.params.id));
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if(!question) res.status(404).send({ "status":404, "error":"Question with given ID was not found"});
    // Adding a vote
    questions[arrIndex].votes++;
    if(recordQuestion(questions)){
        let response = {
            "status" : 200,
            "data" : [{
                "meetup": question.meetup,
                "title": question.title,
                "body": question.body,
                "votes": question.votes
            }]
        };
        res.send(response);
    }
});

// End Upvote (increase votes by 1) a specific question.


module.exports = router;