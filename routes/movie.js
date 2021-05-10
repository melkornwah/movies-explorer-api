const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie
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
      .pattern(new RegExp(/(https|http)?:\/\/.*/i)),
    trailer: Joi.string()
      .required()
      .pattern(new RegExp(/(https|http)?:\/\/.*/i)),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
    thumbnail: Joi.string()
      .required()
      .pattern(new RegExp(/(https|http)?:\/\/.*/i)),
    movieId: Joi.string()
      .required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
