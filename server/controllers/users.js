

import moment from 'moment';
import { validator, validationErrors } from '../helpers/index';
import db from '../models/db';

const Meetups = {
    /**
     * Get All Meetups
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetups array
     */
    async userLogin(req, res) {
        // Validate Data
        const { error } = validator('login', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const findAllQuery = 'SELECT * FROM users WHERE username = $1 AND password = $2 LIMIT 1';
        try {
            const { rows } = await db.query(findAllQuery, [req.body.username, req.body.password]);
            let response = {};
            if (rows[0]) {
                response = {
                    status: 200,
                    data: [{
                        id: rows[0].id,
                        username: rows[0].username,
                        firstname: rows[0].firstname,
                        lastname: rows[0].lastname,
                        othername: rows[0].othername
                    }]
                };
            } else {
                response = {
                    status: 404,
                    message: 'Invalid username or password'
                };
                return res.send(response);
            }
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({ status: 400, error: errorMessage });
        }
    },
    /**
     * Create A Meetup
     * @param {object} req
     * @param {object} res
     * @returns {object} Meetup object
     */
    async userSignup(req, res) {
        // Validate Data
        const { error } = validator('user', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'INSERT INTO users (firstname, lastname, othername, email, phonenumber, username, password, registered, isadmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.othername,
            req.body.email,
            req.body.phonenumber,
            req.body.username,
            req.body.password,
            moment().format('YYYY-MM-DD'),
            req.body.isadmin
        ];
        try {
            await db.query(text, values);
            const response = {
                status: 200,
                data: [{
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    othername: req.body.othername,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    username: req.body.username,
                    isAdmin: req.body.isadmin
                }]
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({ status: 400, error: errorMessage });
        }
    }
};

export default Meetups;