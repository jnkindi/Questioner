import express from 'express';

import Questions from '../controllers/questions';

import Auth from '../middlewares/auth';

const {
    upvoteQuestion, downvoteQuestion, addComment, getComments, deleteComment, updateComment, updateQuestion, deleteQuestion,
} = Questions;

const router = express.Router();

// Updating question info
router.put('/:id', Auth.verifyToken, updateQuestion);

// Upvote (increase votes by 1) a specific question.
router.patch('/:id/upvote', Auth.verifyToken, upvoteQuestion);

// Downvote (decreases votes by 1) a specific question.
router.patch('/:id/downvote', Auth.verifyToken, downvoteQuestion);

// Adds comment on a specific question.
router.post('/:id/comments', Auth.verifyToken, addComment);

// Fetch all comments on a specific question.
router.get('/:id/comments', Auth.verifyToken, getComments);

// Delete comment on a specific question.
router.delete('/:id/comments/:commentid', Auth.verifyToken, deleteComment);

// Updating comment on a specific question.
router.put('/:id/comments/:commentid', Auth.verifyToken, updateComment);

// Updating comment on a specific question.
router.delete('/:id', Auth.verifyToken, deleteQuestion);

export default router;
