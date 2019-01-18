const { meetupTest } = require('./meetups.test');
const { questionTest } = require('./questions.test');
const { usersTest, loginTest } = require('./users.test');

(() => {
    meetupTest();
    questionTest();
    usersTest();
    loginTest();
})();