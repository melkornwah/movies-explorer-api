const router = require('express').Router();
const usersRoute = require('./user');
const moviesRoute = require('./movie');
const auth = require('../middlewares/auth');
const authorization = require('./auth');
const NotFoundError = require('../errors/not-found-error');

router.use('/', authorization);

router.use(auth);

router.use('/', usersRoute, moviesRoute);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена.');
});

module.exports = router;
