

import moment from 'moment';
import crypto from 'crypto';
import {
    validator, validationErrors, hashPassword, comparePassword, generateToken, sendPasswordRecoveryMail,
} from '../helpers/index';
import db from '../models/db';

const Users = {
    /**
     * User Login
     * @param {object} req
     * @param {object} res
     * @returns {object} Users array
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
                role,
            });

            const response = {
                status: 200,
                data: [{ issueToken }],
            };
            return res.status(200).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
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
            return res.status(409).send({
                status: 409,
                error: 'Username already taken',
            });
        }

        const findEmailQuery = 'SELECT * FROM users WHERE email=$1';
        const userEmailResult = await db.query(findEmailQuery, [req.body.email]);
        const userEmailData = userEmailResult.rows;
        if (userEmailData[0]) {
            return res.status(409).send({
                status: 409,
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

            const userdata = {
                username: rows[0].username,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                othername: rows[0].othername,
                email: rows[0].email,
                phonenumber: rows[0].phonenumber,
                isadmin: rows[0].isadmin,
            };

            const response = {
                status: 201,
                data: userdata,
            };
            return res.status(201).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
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
            return res.status(200).send(response);
        } catch (errorMessage) {
            return res.status(500).send({ status: 500, error: errorMessage });
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
            return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
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
            return res.status(204).send({
                status: 204,
                data: 'User deleted',
            });
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
                status: 200,
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
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
    /**
     * User Signup
     * @param {object} req
     * @param {object} res
     * @returns {object} User object
     */
    async userRecoverPassword(req, res) {
        // Validate Data
        const { error } = validator('recoverPassword', req.body);
        if (error) {
            return validationErrors(res, error);
        }

        let result = true;

        const findEmailQuery = 'SELECT id, firstname, lastname, othername FROM users WHERE email=$1';
        const userEmailResult = await db.query(findEmailQuery, [req.body.email]);
        const { rows } = userEmailResult;
        if (rows[0]) {
            const recoverCode = Math.floor(Math.random() * 100000);
            const hashedText = crypto.createHash('md5').update(recoverCode.toString()).digest('hex');
            const userid = rows[0].id;

            const resetUsedCode = 'UPDATE recoverpassword SET status = $1 WHERE (userid = $2 OR code = $3 OR hash = $4) AND (status = $5)';
            await db.query(resetUsedCode, ['Expired', userid, recoverCode, hashedText, 'Pending']);

            const recoverPassword = 'INSERT INTO recoverpassword(userid, code, hash, status, date) VALUES($1, $2, $3, $4, $5)';
            await db.query(recoverPassword, [userid, recoverCode, hashedText, 'Pending', moment().format('YYYY-MM-DD')]);

            const names = `${rows[0].firstname} ${rows[0].lastname} ${rows[0].othername}`;

            if (sendPasswordRecoveryMail(names, recoverCode, hashedText, req.body.email)) {
                result = true;
            } else {
                result = false;
            }
        }

        result = ((result) ? res.status(200).send({
            status: 200,
            data: 'Check your email for a link and access code to reset your password.',
        }) : result = res.status(500).send({
            status: 500,
            error: 'Something went wrong, Try again later!',
        }));

        return result;
    },
    /**
     * Checks specific searched hash
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async checkPasswordResetHash(req, res) {
        const text = 'SELECT userid as user FROM recoverpassword WHERE hash = $1 AND status = $2';
        try {
            const { rows } = await db.query(text, [req.params.hash, 'Pending']);
            if (!rows[0]) {
                return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
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
     * Reset password using a specific searched hash
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async resetPasswordByHash(req, res) {
        const text = 'SELECT userid FROM recoverpassword WHERE hash = $1 AND status = $2';
        try {
            const { rows } = await db.query(text, [req.params.hash, 'Pending']);
            if (!rows[0]) {
                return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
            }

            // Validate Data
            const { error } = validator('ResetPasswordUsingHash', req.body);
            if (error) {
                return validationErrors(res, error);
            }

            const { userid } = rows[0];
            const hashedPassword = hashPassword(req.body.password);

            const resetPassword = 'UPDATE users SET password = $1 WHERE id = $2';
            await db.query(resetPassword, [hashedPassword, userid]);

            const removeResetHash = 'UPDATE recoverpassword SET status = $1 WHERE userid = $2 AND status = $3';
            await db.query(removeResetHash, ['Used', userid, 'Pending']);

            const response = {
                status: 200,
                data: 'Password Reset Successfully!',
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
    /**
     * Reset password using a specific searched hash
     * @param {object} req
     * @param {object} res
     * @returns {object} meetup object
     */
    async resetPasswordByAccessCode(req, res) {
        // Validate Data
        const { error } = validator('ValidateResetCode', req.body);
        if (error) {
            return validationErrors(res, error);
        }
        const text = 'SELECT userid as user FROM recoverpassword WHERE code = $1 AND status = $2';
        try {
            const { rows } = await db.query(text, [req.body.code, 'Pending']);
            if (!rows[0]) {
                return res.status(403).send({ status: 403, error: 'Unauthorized Access' });
            }

            if (!(req.body.password)) {
                const response = {
                    status: 200,
                    data: rows[0],
                };
                return res.status(200).send(response);
            }

            // Validate Data
            const { error } = validator('ResetPasswordUsingResetCode', req.body);
            if (error) {
                return validationErrors(res, error);
            }

            const { user } = rows[0];
            const hashedPassword = hashPassword(req.body.password);

            const resetPassword = 'UPDATE users SET password = $1 WHERE id = $2';
            await db.query(resetPassword, [hashedPassword, user]);

            const removeResetHash = 'UPDATE recoverpassword SET status = $1 WHERE userid = $2 AND status = $3';
            await db.query(removeResetHash, ['Used', user, 'Pending']);

            const response = {
                status: 200,
                data: 'Password Reset Successfully!',
            };
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send({ status: 500, error });
        }
    },
};

export default Users;
