const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Welcoming
app.get('/', (req, res)=> {
  res.send('Questioner App');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;