

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
     * User Signup
     * @param {object} req
     * @param {object} res
     * @returns {object} User object
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
    },
    /**
     * Update a user info
     * @param {object} req
     * @param {object} res
     * @returns {object} User object
     */
    async updateUser(req, res) {
        const { error } = validator('updateUser', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'UPDATE users SET firstname = $1, lastname = $2, othername = $3, email = $4, phonenumber = $5, username = $6, isadmin = $7 WHERE id = $8';
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.othername,
            req.body.email,
            req.body.phonenumber,
            req.body.username,
            req.body.isadmin,
            req.params.id,
        ];
        try {
            const findOneQuery = 'SELECT * FROM users WHERE id=$1';
            const userResult = await db.query(findOneQuery, [req.params.id]);
            const userData = userResult.rows;
            if (!userData[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'User with given ID was not found'
                });
            }

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
                    isAdmin: req.body.isadmines
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

export default Meetups;