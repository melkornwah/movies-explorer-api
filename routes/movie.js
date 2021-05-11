const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');

const imgRegExp = '/.*.(gif|jpe?g|bmp|png)$/im';
const videoRegExp = '/youtu(?:.*/v/|.*v=|.be/)([A-Za-z0-9_-]{11})/im';

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
      .pattern(new RegExp(imgRegExp)),
    trailer: Joi.string()
      .required()
      .pattern(new RegExp(videoRegExp)),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
    thumbnail: Joi.string()
      .required()
      .pattern(new RegExp(imgRegExp)),
    movieId: Joi.number()
      .required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
