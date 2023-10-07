const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
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
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
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
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.editUserData = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
