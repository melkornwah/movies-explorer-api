const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errors');
const routes = require('./routes/index');
const limiter = require('./middlewares/rate-limiter');

const { NODE_ENV, DB_ADRESS } = process.env;

const app = express();

app.use(helmet());

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB_ADRESS : 'mongodb://localhost:27017/moviesdb', {
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

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errorsHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App is running...');
});
