import meetupTest from './meetups.test';
import questionTest from './questions.test';
import { usersTest, loginTest } from './users.test';

(() => {
    meetupTest();
    questionTest();
    usersTest();
    loginTest();
})();