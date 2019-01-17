const express = require('express');

const meetups = require('./meetups');
const questions = require('./questions');
const authentication = require('./authentication');

const app = express();


app.use('/meetups', meetups);
app.use('/questions', questions);
app.use('/auth', authentication);

module.exports = app;