const mongoose = require('mongoose');
const { urlRegExp } = require('../constants/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальное количество символов - 2'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальное количество символов - 2'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    default: '',
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальное количество символов - 2'],
  },
  image: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (img) => urlRegExp.test(img),
      message: 'Неверно указан URL изобрaжения',
    },
  },
  trailerLink: {
    type: String,
    default: '',
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (url) => urlRegExp.test(url),
      message: 'Неверно указан URL',
    },
  },
  thumbnail: {
    type: String,
    default: '',
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (url) => urlRegExp.test(url),
      message: 'Неверно указан URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Поле должно быть заполнено'],
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
