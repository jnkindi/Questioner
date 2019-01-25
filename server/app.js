import express from 'express';

import ENV from 'dotenv';
import routes from './routes/index';
import migration from './config/migration/index';

ENV.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));


app.use('/api/v1/', routes);

// Welcoming
app.get('/', (req, res) => {
  res.send('Questioner App');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Unknown Instruction');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
  });
});

export default app;
