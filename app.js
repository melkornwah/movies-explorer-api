const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRoute = require('./routes/user');
const moviesRoute = require('./routes/movie');
const auth = require('./middlewares/auth');
const authorize = require('./routes/auth');
const NotFoundError = require('./errors/not-found-error');

const app = express();

app.use(helmet());

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');

  next();
});

app.use(cors({ origin: true, credentials: true }));

app.use('/', authorize);

app.use(auth);

app.use('/', usersRoute, moviesRoute);

app.use(errorLogger);

app.use('*', () => {
  throw new NotFoundError('Страница не найдена.');
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({
      message: err.message,
      statusCode: err.statusCode,
    });

  next();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App is running...');
});
