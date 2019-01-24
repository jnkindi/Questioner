import moment from 'moment';

import { validator, validationErrors } from '../helpers/index';
import db from '../models/db';

const Questions = {
    /**
     * Add upvotevote to question of a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Question object
     */
    async upvoteQuestion(req, res) {
        const text = 'UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1';
        try {
            const findQuestionQuery = 'SELECT * FROM questions WHERE id=$1';
            const questionResult = await db.query(findQuestionQuery, [req.params.id]);
            const questionData = questionResult.rows;
            if (!questionData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Question with given ID was not found'
                });
            }

            const meetupID = questionData[0].meetupid;
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [meetupID]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup associated to question was not found'
                });
            }


            await db.query(text, [req.params.id]);
            const response = {
                status: 200,
                data: [{
                    meetup: meetupData[0].topic,
                    questionTitle: questionData[0].title,
                    questionBody: questionData[0].body
                }]
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage
            });
        }
    },
    /**
     * Add downvote to question of a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Question object
     */
    async downvoteQuestion(req, res) {
        const text = 'UPDATE questions SET downvotes = downvotes + 1 WHERE id = $1';
        try {
            const findQuestionQuery = 'SELECT * FROM questions WHERE id=$1';
            const questionResult = await db.query(findQuestionQuery, [req.params.id]);
            const questionData = questionResult.rows;
            if (!questionData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Question with given ID was not found'
                });
            }

            const meetupID = questionData[0].meetupid;
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [meetupID]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup associated to question was not found'
                });
            }


            await db.query(text, [req.params.id]);
            const response = {
                status: 200,
                data: [{
                    meetup: meetupData[0].topic,
                    questionTitle: questionData[0].title,
                    questionBody: questionData[0].body
                }]
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage
            });
        }
    },
    /**
     * Add comment to Question
     * @param {object} req
     * @param {object} res
     * @returns {object} Comment object
     */
    async addComment(req, res) {
        const { error } = validator('comment', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'INSERT INTO questioncomments(questionid, userid, comment, createdon) VALUES($1, $2, $3, $4)';
        const values = [
            req.params.id,
            req.body.user,
            req.body.comment,
            moment().format('YYYY-MM-DD')
        ];
        try {
            const findOneQuery = 'SELECT * FROM questions WHERE id=$1';
            const questionResult = await db.query(findOneQuery, [req.params.id]);
            const questionData = questionResult.rows;
            if (!questionData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Question with given ID was not found'
                });
            }

            const findUserQuery = 'SELECT * FROM users WHERE id=$1';
            const userResult = await db.query(findUserQuery, [req.body.user]);
            const userData = userResult.rows;
            if (!userData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'User with given ID was not found'
                });
            }

            const { title } = questionData[0];
            await db.query(text, values);
            const response = {
                status: 200,
                data: [{
                    comment: req.body.comment,
                    title,
                    createdon: moment().format('YYYY-MM-DD')
                }]
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage
            });
        }
    },
    /**
     * Get Specific Meetup comments
     * @param {object} req
     * @param {object} res
     * @returns {object} comments object
     */
    async getComments(req, res) {
        const text = 'SELECT users.firstname, users.lastname, users.othername, questioncomments.comment, questioncomments.createdon FROM users, questioncomments WHERE questioncomments.id = $1 AND questioncomments.userid = users.id';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found'
                });
            }
            const response = {
                status: 200,
                data: rows[0]
            };
            return res.send(response);
        } catch (error) {
            return res.status(400).send({
                status: 400,
                error
            });
        }
    },
    /**
     * Delete a Comment
     * @param {object} req
     * @param {object} res
     * @returns {object} Comment object
     */
    async deleteComment(req, res) {
        const text = 'DELETE FROM questioncomments WHERE id = $1 returning *';
        try {
            const { rows } = await db.query(text, [req.params.commentid]);
            if (!rows[0]) {
              return res.status(404).send({
                status: 404,
                error: 'Comment with given ID was not found'
            });
            }
            return res.status(200).send({
                status: 200,
                data: 'Comment deleted'
            });
          } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage
            });
        }
    },
    /**
     * Add upvotevote to question of a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Question object
     */
    async updateComment(req, res) {
        const { error } = validator('updateComment', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE questioncomments SET comment = $1 WHERE id = $2';
        try {
            const findCommentQuery = 'SELECT * FROM questioncomments WHERE id=$1';
            const questionResult = await db.query(findCommentQuery, [req.params.commentid]);
            const commentData = questionResult.rows;
            if (!commentData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Comment with given ID was not found'
                });
            }

            await db.query(text, [req.body.comment, req.params.commentid]);
            const response = {
                status: 200,
                data: [{
                    comment: req.body.comment,
                    createdon: commentData[0].createdon
                }]
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage
            });
        }
    }
};
export default Questions;