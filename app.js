const express = require('express');

const app = express();

const meetups = require('./endpoints/meetups');
const questions = require('./endpoints/questions');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/v1/meetups', meetups);
app.use('/api/v1/questions', questions);


// Welcoming
app.get('/', (req, res)=> {
  res.send('Questioner App');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Unknown Instruction');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;