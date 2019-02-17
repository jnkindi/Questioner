import moment from 'moment';
import { validator, validationErrors } from '../helpers/index';
import db from '../models/db';

const Meetups = {
    /**
     * Create A Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async addMeetup(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        // Validate Data
        const { error } = validator('meetup', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'INSERT INTO meetups (createdon, location, images, topic, description, happeningon, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *';
        const values = [
            moment().format('YYYY-MM-DD'),
            req.body.location,
            req.body.images,
            req.body.topic,
            req.body.description,
            req.body.happeningon,
            req.body.tags,
        ];
        try {
            const { rows } = await db.query(text, values);
            const response = {
                status: 201,
                data: [{
                    id: rows[0].id,
                    topic: req.body.topic,
                    description: req.body.description,
                    location: req.body.location,
                    happeningon: req.body.happeningon,
                    images: req.body.images,
                    tags: req.body.tags,
                }],
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Get All Meetups
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetups array
     */
    async getMeetups(req, res) {
        const findAllQuery = 'SELECT * FROM meetups ORDER BY id DESC';
        try {
            const { rows } = await db.query(findAllQuery);
            const data = ((rows.length !== 0) ? rows : 'No Meetups Found');
            const response = {
                status: 200,
                data,
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
    /**
     * Get All Upcoming Meetups
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetups array
     */
    async upcomingMeetups(req, res) {
        const findAllQuery = 'SELECT * FROM meetups WHERE happeningOn > $1 ORDER BY happeningOn ASC';
        const values = [
            moment().format('YYYY-MM-DD'),
        ];
        try {
            const { rows } = await db.query(findAllQuery, values);
            const data = ((rows.length !== 0) ? rows : 'No Meetups Found');
            const response = {
                status: 200,
                data,
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
    /**
     * Get A Specific Meetup details
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async specificMeetup(req, res) {
        const text = 'SELECT * FROM meetups WHERE id = $1';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            const response = {
                status: 200,
                data: rows[0],
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
    /**
     * RSVP A Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async rsvpMeetup(req, res) {
        const { error } = validator('rsvps', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        let text = 'INSERT INTO rsvps(meetupid, userid, response) VALUES($1, $2, $3)';
        let values = [
            req.params.id,
            req.user.id,
            req.body.response,
        ];

        const findRsvpsQuery = 'SELECT * FROM rsvps WHERE meetupid=$1 AND userid=$2';
        const rsvpsResult = await db.query(findRsvpsQuery, [req.params.id, req.user.id]);
        const rsvpsData = rsvpsResult.rows;
        if (rsvpsData[0]) {
            const rsvpId = rsvpsData[0].id;
            text = `UPDATE rsvps SET response = $1 WHERE id = ${rsvpId}`;
            values = [req.body.response];
        }

        try {
            const findOneQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findOneQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }

            const findUserQuery = 'SELECT * FROM users WHERE id=$1';
            const userResult = await db.query(findUserQuery, [req.user.id]);
            const userData = userResult.rows;
            if (!userData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'User with given ID was not found',
                });
            }

            const { topic } = meetupData[0];
            await db.query(text, values);
            const response = {
                status: 201,
                data: [{
                    meetup: req.params.id,
                    topic,
                    status: req.body.response,
                }],
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Delete A Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async deleteMeetup(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        const text = 'DELETE FROM meetups WHERE id = $1 returning *';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
              return res.status(404).send({
                status: 404,
                error: 'Meetup with given ID was not found',
            });
            }
            return res.status(204).send({
                status: 204,
                data: 'Meetup deleted',
            });
          } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Add a question to a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async addQuestion(req, res) {
        const { error } = validator('question', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'INSERT INTO questions(createdon, createdby, meetupid, title, body, upvotes, downvotes) VALUES($1, $2, $3, $4, $5, $6, $7) returning *';
        const values = [
            moment().format('YYYY-MM-DD'),
            req.user.id,
            parseInt(req.params.id, 10),
            req.body.title,
            req.body.body,
            0,
            0,
        ];
        try {
            const findUserQuery = 'SELECT * FROM users WHERE id=$1';
            const userResult = await db.query(findUserQuery, [req.user.id]);
            const userData = userResult.rows;
            if (!userData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'User with given ID was not found',
                });
            }

            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            const { rows } = await db.query(text, values);
            const response = {
                status: 201,
                data: [{
                    id: rows[0].id,
                    user: req.user.id,
                    meetup: req.params.id,
                    title: req.body.title,
                    body: req.body.body,
                }],
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(400).send({ status: 400, error: errorMessage });
        }
    },
    /**
     * Get All Questions
     * @param {object} req
     * @param {object} res
     * @returns {object} Questions array
     */
    async getQuestions(req, res) {
        const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
        const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
        const meetupData = meetupResult.rows;
        if (!meetupData[0]) {
            return res.status(404).send({
                status: 404,
                error: 'Meetup with given ID was not found',
            });
        }
        const findAllQuery = 'SELECT * FROM questions WHERE meetupid = $1';
        try {
            const { rows } = await db.query(findAllQuery, [req.params.id]);
            const data = ((rows.length !== 0) ? rows : 'No Questions Found');
            const response = {
                status: 200,
                data,
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },

    /**
     * Add a images to a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async addMeetupImages(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        const { error } = validator('addMeetupImages', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE meetups SET images = array_cat(images, $1) returning *';
        try {
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            await db.query(text, [req.body.images]);
            const response = {
                status: 201,
                data: [{
                    topic: meetupData[0].topic,
                    description: meetupData[0].description,
                    location: meetupData[0].location,
                    happeningon: meetupData[0].happeningon,
                    images: meetupData[0].images,
                    tags: meetupData[0].tags,
                }],
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Remove an image to a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async removeMeetupImages(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        const { error } = validator('removeMeetupImages', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE meetups SET images = array_remove(images, $1) returning *';
        try {
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            await db.query(text, [req.body.images]);
            const response = {
                status: 204,
                data: [{
                    topic: meetupData[0].topic,
                    description: meetupData[0].description,
                    location: meetupData[0].location,
                    happeningon: meetupData[0].happeningon,
                    images: meetupData[0].images,
                    tags: meetupData[0].tags,
                }],
            };
            return res.status(204).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },

    /**
     * Add a tag to a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async addMeetupTags(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        const { error } = validator('addMeetupTags', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE meetups SET tags = array_cat(tags, $1) WHERE id = $2 returning *';
        try {
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            await db.query(text, [req.body.tags, req.params.id]);
            const response = {
                status: 201,
                data: [{
                    topic: meetupData[0].topic,
                    description: meetupData[0].description,
                    location: meetupData[0].location,
                    happeningon: meetupData[0].happeningon,
                    images: meetupData[0].images,
                    tags: meetupData[0].tags,
                }],
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Remove a tag from a Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async removeMeetupTags(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
        }
        const { error } = validator('removeMeetupTags', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE meetups SET tags = array_remove(tags, $1) WHERE id = $2 returning *';
        try {
            const findMeetupQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findMeetupQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }
            await db.query(text, [req.body.tags, req.params.id]);
            const response = {
                status: 204,
                data: [{
                    topic: meetupData[0].topic,
                    description: meetupData[0].description,
                    location: meetupData[0].location,
                    happeningon: meetupData[0].happeningon,
                    images: meetupData[0].images,
                    tags: meetupData[0].tags,
                }],
            };
            return res.status(204).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Update a meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async updateMeetup(req, res) {
        const { error } = validator('updateMeetup', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE meetups SET createdon = $1, location = $2, topic = $3, description = $4, happeningon = $5 WHERE id = $6';
        const values = [
            req.body.createon,
            req.body.location,
            req.body.topic,
            req.body.description,
            req.body.happeningon,
            req.params.id,
        ];
        try {
            const findOneQuery = 'SELECT * FROM meetups WHERE id=$1';
            const meetupResult = await db.query(findOneQuery, [req.params.id]);
            const meetupData = meetupResult.rows;
            if (!meetupData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Meetup with given ID was not found',
                });
            }

            await db.query(text, values);
            const response = {
                status: 200,
                data: [{
                    topic: req.body.topic,
                    description: req.body.description,
                    location: req.body.location,
                    happeningon: req.body.happeningon,
                    images: meetupData[0].images,
                    tags: meetupData[0].tags,
                }],
            };
            return res.status(200).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
        }
    },
    /**
     * Get A Specific Meetup details
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async searchMeetup(req, res) {
        const errorMessage = req.query.topic || false;
        if (!errorMessage) {
            return res.status(400).send({ status: 400, error: 'Provide search topic' });
        }
        const text = `SELECT * FROM meetups WHERE topic like '%${req.query.topic}%'`;
        try {
            const { rows } = await db.query(text);
            if (!rows[0]) {
                return res.status(404).send({
                    status: 404,
                    data: 'No meetup found',
                });
            }
            const response = {
                status: 200,
                data: rows,
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 400, error });
        }
    },
    /**
     * Get Trending Questions
     * @param {object} req
     * @param {object} res
     * @returns {object} Questions array
     */
    async getTrendingQuestions(req, res) {
        const findAllQuery = 'SELECT createdon, createdby, meetupid, title, body, upvotes, downvotes, (upvotes+downvotes) AS totalvotes FROM questions WHERE meetupid = $1 ORDER BY totalvotes DESC';
        try {
            const { rows } = await db.query(findAllQuery, [req.params.id]);
            const data = ((rows.length !== 0) ? rows : 'No Questions Found');
            const response = {
                status: 200,
                data,
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
};

export default Meetups;
