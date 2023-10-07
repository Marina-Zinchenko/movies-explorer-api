const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const {
  validateUserCreate,
  validateUserLogin,
} = require('../middlewares/celebrateErrors');

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserCreate, createUser);
router.use(auth);
router.use('/users', require('./usersRoutes'));
router.use('/movies', require('./moviesRoutes'));

module.exports = router;
