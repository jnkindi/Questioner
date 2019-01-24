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
    }
};
export default Questions;