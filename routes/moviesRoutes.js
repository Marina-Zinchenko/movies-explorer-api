const router = require('express').Router();
const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateMoviePost,
  validateMovieId,
} = require('../middlewares/celebrateErrors');

router.get('/', getMovies); // возвращает все сохранённые текущим пользователем фильмы
router.post('/', validateMoviePost, addMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
router.delete('/:movieId', validateMovieId, deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
