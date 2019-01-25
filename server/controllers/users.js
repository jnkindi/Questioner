

import moment from 'moment';
import {
    validator, validationErrors, hashPassword, comparePassword, generateToken,
} from '../helpers/index';
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
        const findAllQuery = 'SELECT * FROM users WHERE username = $1 LIMIT 1';
        try {
            const { rows } = await db.query(findAllQuery, [req.body.username]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'Invalid username or password',
                });
            }
            if (!comparePassword(rows[0].password, req.body.password)) {
                return res.status(404).send({
                    status: 404,
                    error: 'Invalid username or password',
                });
            }
            const role = ((rows[0].isadmin) ? 'admin' : 'standard');
            const issueToken = generateToken({
                user: rows[0].id,
                username: rows[0].username,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                othername: rows[0].othername,
                email: rows[0].email,
                phonenumber: rows[0].phonenumber,
                role,
            });

            const response = {
                status: 200,
                data: [{ issueToken }],
            };
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
        const findUsernameQuery = 'SELECT * FROM users WHERE username=$1';
        const userResult = await db.query(findUsernameQuery, [req.body.username]);
        const userData = userResult.rows;
        if (userData[0]) {
            return res.status(400).send({
                status: 400,
                error: 'Username already taken',
            });
        }

        const findEmailQuery = 'SELECT * FROM users WHERE email=$1';
        const userEmailResult = await db.query(findEmailQuery, [req.body.email]);
        const userEmailData = userEmailResult.rows;
        if (userEmailData[0]) {
            return res.status(400).send({
                status: 400,
                error: 'Email already taken',
            });
        }

        const hashedPassword = hashPassword(req.body.password);

        const text = 'INSERT INTO users (firstname, lastname, othername, email, phonenumber, username, password, registered, isadmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.othername,
            req.body.email,
            req.body.phonenumber,
            req.body.username,
            hashedPassword,
            moment().format('YYYY-MM-DD'),
            req.body.isadmin,
        ];
        try {
            const { rows } = await db.query(text, values);

            const role = ((rows[0].isadmin) ? 'admin' : 'standard');

            const issueToken = generateToken({
                user: rows[0].id,
                username: rows[0].username,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                othername: rows[0].othername,
                email: rows[0].email,
                phonenumber: rows[0].phonenumber,
                role,
            });

            const response = {
                status: 200,
                data: [{ issueToken }],
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
                    error: 'User with given ID was not found',
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
                    isAdmin: req.body.isadmin,
                }],
            };
            return res.send(response);
        } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage,
            });
        }
    },
    /**
     * Delete a User
     * @param {object} req
     * @param {object} res
     * @returns {object} User object
     */
    async deleteUser(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(401).send({ status: 401, error: 'Unauthorized Access' });
        }
        const text = 'DELETE FROM users WHERE id = $1 returning *';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
              return res.status(404).send({
                status: 404,
                error: 'User with given ID was not found',
            });
            }
            return res.status(200).send({
                status: 200,
                data: 'User deleted',
            });
          } catch (errorMessage) {
            return res.status(400).send({
                status: 400,
                error: errorMessage,
            });
        }
    },
    /**
     * Get A Specific Meetup details
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async userInformation(req, res) {
        const text = 'SELECT * FROM users WHERE id = $1';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: 404,
                    error: 'User with given ID was not found',
                });
            }
            const response = {
                status: 201,
                data: [{
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    othername: rows[0].othername,
                    email: rows[0].email,
                    phonenumber: rows[0].phonenumber,
                    username: rows[0].username,
                    isAdmin: rows[0].isadmin,
                }],
            };
            return res.send(response);
        } catch (error) {
            return res.status(400).send({
                status: 400,
                error,
            });
        }
    },
};

export default Meetups;
