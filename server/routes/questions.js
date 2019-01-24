import express from 'express';

import Questions from '../controllers/questions';

const { upvoteQuestion, downvoteQuestion } = Questions;

const router = express.Router();

// Upvote (increase votes by 1) a specific question.
router.patch('/:id/upvote', upvoteQuestion);

// Downvote (decreases votes by 1) a specific question.
router.patch('/:id/downvote', downvoteQuestion);
export default router;