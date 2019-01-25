import jwt from 'jsonwebtoken';
import db from '../models/db';

const Auth = {
    /**
    * Verify Token
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {object|void} response object
    */
    async verifyToken(req, res, next) {
        const token = req.headers['auth-access'];
        if (!token) {
            return res.status(401).send({ status: 401, error: 'No token was provided' });
        }
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await db.query(text, [decoded.user]);
            if (!rows[0]) {
                return res.status(403).send({ status: 403, error: 'The token you provided is invalid' });
            }
            req.user = { id: decoded.user, role: decoded.role };
            next();
        } catch (error) {
            return res.status(400).send({ status: 400, error });
        }
        return true;
    },
};

export default Auth;
