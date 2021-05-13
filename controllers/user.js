const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => {
      res.json(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (!data) {
        User.findByIdAndUpdate(req.user._id, {
          $set: {
            name: req.body.name,
            email: req.body.email,
          },
        },
        { runValidators: true, new: true })
          .orFail(new Error('Пользователь по указанному _id не найден.'))
          .then((user) => {
            res.json(user);
          })
          .catch((err) => {
            if (err.name === 'ValidationError' || err.message === 'Переданы некорректные данные при обновлении профиля.') {
              throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
            }
            if (err.message === 'Пользователь по указанному _id не найден.') {
              throw new NotFoundError(err.message);
            }
            throw new ServerError('Произошла ошибка на сервере.');
          });
      } else {
        throw new ConflictError('Пользователь по указанному email уже зарегистрирован.');
      }
    })
    .catch(next);
};
