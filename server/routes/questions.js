import express from 'express';

import { upvoteQuestion, downvoteQuestion } from '../controllers/questions';

const router = express.Router();

// Upvote (increase votes by 1) a specific question.
router.patch('/:id/upvote', upvoteQuestion);

// Downvote (decreases votes by 1) a specific question.
router.patch('/:id/downvote', downvoteQuestion);
export default router;