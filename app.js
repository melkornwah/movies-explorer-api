const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRoute = require('./routes/user');
const moviesRoute = require('./routes/movie');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/auth');
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
  }),
}), login);

app.use(auth);

app.use('/', usersRoute, moviesRoute);

app.use(errorLogger);

app.use('*', () => {
  throw new NotFoundError('Страница не найдена.');
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 400).json({ message: err.message });

  next();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App is running...');
});
