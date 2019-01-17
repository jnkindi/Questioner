const express = require('express');

const router = express.Router();

const QuestionsRoutes = require('../controllers/questions');

const { upvoteQuestion, downvoteQuestion } = QuestionsRoutes;
// Upvote (increase votes by 1) a specific question.
router.patch('/:id/upvote', upvoteQuestion);

// Downvote (decreases votes by 1) a specific question.
router.patch('/:id/downvote', downvoteQuestion);
module.exports = router;