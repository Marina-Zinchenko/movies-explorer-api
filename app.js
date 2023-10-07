const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validationErrorServer = require('./middlewares/validationErrorServer');
const { limiter } = require('./constants/constants');

const routes = require('./routes/index');
const { MONGO_URL } = require('./config');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Что то пошло не так, загрузка сервера  прервана');
  }, 0);
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(validationErrorServer);

app.listen(PORT);
