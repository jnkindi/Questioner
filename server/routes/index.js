import express from 'express';

import meetups from './meetups';
import questions from './questions';
import authentication from './authentication';
import users from './users';

const app = express();


app.use('/meetups', meetups);
app.use('/questions', questions);
app.use('/auth', authentication);
app.use('/users', users);

export default app;
