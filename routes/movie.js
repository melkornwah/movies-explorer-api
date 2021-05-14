const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .required(),
    year: Joi.string()
      .required()
      .length(4),
    description: Joi.string()
      .required(),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле image заполнено некорректно.');
      }),
    trailer: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailer заполнено некорректно.');
      }),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле tumbnail заполнено некорректно.');
      }),
    movieId: Joi.number()
      .required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
