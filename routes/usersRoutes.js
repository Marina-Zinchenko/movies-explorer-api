const router = require('express').Router();
const { getUsers, editUserData } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/celebrateErrors');

router.get('/me', getUsers); // возвращает информацию о пользователе (email и имя)
router.patch('/me', validateUserUpdate, editUserData); // обновляет информацию о пользователе (email и имя)

module.exports = router;
