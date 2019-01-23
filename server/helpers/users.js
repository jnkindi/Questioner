let usersFetched = [];
try {
    usersFetched = require('../models/users.json');
} catch (err) {
    usersFetched = [];
}

if (typeof (usersFetched) !== 'object') {
    usersFetched = [];
}

module.exports = {
    users: usersFetched
};