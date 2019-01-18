
const usersHelpers = require('../helpers/users');

const { validateLogin, users, validateUser, recordUser } = usersHelpers;

const userLogin = (req, res) => {
    // Validate Data
    const { error } = validateLogin(req.body);
    if (error) {
        const errorMessage = error.details.map(d => d.message);
        return res.status(400).send({
            status: 400,
            error: errorMessage
        });
    }
    const user = users.find(u => (u.username === req.body.username)
    && (u.password === req.body.password));
    if (!user) {
        return res.status(404).send({
            status: 404,
            error: 'Invalid credentials'
        });
    }
    const response = {
        status: 200,
        data: [{
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            othername: user.othername
        }]
    };
    return res.send(response);
};

const userSignup = (req, res) => {
    // Validate Data
    const { error } = validateUser(req.body);
    if (error) {
        const errorMessage = error.details.map(d => d.message);
        return res.status(400).send({
            status: 400,
            error: errorMessage
        });
    }
    const user = {
        id: users.length + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        othername: req.body.othername,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        username: req.body.username,
        password: req.body.password,
        registered: new Date().toISOString().replace('T', ' ').replace(/\..*$/, ''),
        isAdmin: req.body.isAdmin
    };

    users.push(user);
    if (recordUser(users)) {
        const response = {
            status: 200,
            data: [{
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                othername: req.body.othername,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                username: req.body.username,
                isAdmin: req.body.isAdmin
            }]
        };
        res.send(response);
    }
    return true;
};

module.exports = {
    userLogin,
    userSignup
};