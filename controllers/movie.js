const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (movies.length === 0) {
        res.json({ message: 'Сохранённых фильмов пока нет.' });
      } else {
        res.json(movies);
      }
    })
    .catch(() => {
      throw new ServerError('Произошла ошибка на сервере.');
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  const { body } = req;

  body.owner = owner;

  Movie.create(body)
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма.');
      }
      throw new ServerError('Произошла ошибка на сервере.');
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('Фильм с указанным _id не найден.'))
    .then((movie) => {
      const ownerId = movie.owner;

      if (ownerId.toString() === req.user._id.toString()) {
        return movie.remove()
          .then(() => res.json({ message: 'Фильм был удалён.' }));
      }
      throw new Error('Вы не являетесь владельцем фильма.');
    })
    .catch((err) => {
      if (err.message === 'Фильм с указанным _id не найден.') {
        throw new NotFoundError(err.message);
      }
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Неверно указан _id фильма.');
      }
      if (err.message === 'Вы не являетесь владельцем фильма.') {
        throw new ForbiddenError('Вы не являетесь владельцем фильма.');
      }
      throw new ServerError('Произошла ошибка на сервере.');
    })
    .catch(next);
};
