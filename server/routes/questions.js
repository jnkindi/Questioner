const express = require('express');
const database = require('../controllers/questions');

const router = express.Router();

const { questions, recordQuestion } = database;


// Upvote (increase votes by 1) a specific question.

router.patch('/:id/upvote', (req, res) => {
    const arrIndex = questions.findIndex(q => q.id === parseInt(req.params.id, 10));
    const question = questions.find(q => q.id === parseInt(req.params.id, 10));
    if (!question) {
        return res.status(404).send({
            status: 404,
            error: 'Question with given ID was not found'
        });
    }
    // Adding a vote
    questions[arrIndex].upvotes += 1;
    if (recordQuestion(questions)) {
        const response = {
            status: 200,
            data: [{
                meetup: question.meetup,
                title: question.title,
                body: question.body,
                votes: question.votes
            }]
        };
        res.send(response);
    }
    return true;
});

// End Upvote (increase votes by 1) a specific question.


// Downvote (decreases votes by 1) a specific question.

router.patch('/:id/downvote', (req, res) => {
    const arrIndex = questions.findIndex(q => q.id === parseInt(req.params.id, 10));
    const question = questions.find(q => q.id === parseInt(req.params.id, 10));
    if (!question) {
      return res.status(404).send({
            status: 404,
            error: 'Question with given ID was not found'
        });
    }
    // Adding a vote
    questions[arrIndex].downvotes += 1;
    if (recordQuestion(questions)) {
        const response = {
            status: 200,
            data: [{
                meetup: question.meetup,
                title: question.title,
                body: question.body,
                votes: question.votes
            }]
        };
        res.send(response);
    }
    return true;
});

// End Downvote (decreases votes by 1) a specific question.


module.exports = router;