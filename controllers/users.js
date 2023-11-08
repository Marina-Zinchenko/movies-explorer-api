const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET } = require('../config');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          _id: user._id,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'MongoServerError' || err.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы неккоректные данные для создания пользователя.'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' || err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегистрирован.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неккоректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};
