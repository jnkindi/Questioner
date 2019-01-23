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
    questions: questionsFetched
};