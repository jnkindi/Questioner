import express from 'express';

import Questions from '../controllers/questions';

const { upvoteQuestion, downvoteQuestion, addComment, getComments, deleteComment, updateComment, updateQuestion } = Questions;

const router = express.Router();

// Updating question info
router.put('/:id', updateQuestion);

// Upvote (increase votes by 1) a specific question.
router.patch('/:id/upvote', upvoteQuestion);

// Downvote (decreases votes by 1) a specific question.
router.patch('/:id/downvote', downvoteQuestion);

// Adds comment on a specific question.
router.post('/:id/comments', addComment);

// Fetch all comments on a specific question.
router.get('/:id/comments', getComments);

// Delete comment on a specific question.
router.delete('/:id/comments/:commentid', deleteComment);

// Updating comment on a specific question.
router.put('/:id/comments/:commentid', updateComment);
export default router;