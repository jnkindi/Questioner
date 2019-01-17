const questionHelpers = require('../helpers/questions');

const { questions, recordQuestion } = questionHelpers;

const upvoteQuestion = (req, res) => {
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
};
const downvoteQuestion = (req, res) => {
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
};

module.exports = {
    upvoteQuestion,
    downvoteQuestion
};