const express = require('express');
const morgan = require('morgan');
const pageRouter = require(`./Routers/pageRouter`);
const APIError = require('./utils/APIError');
const globalErrorHandler = require('./Controllers/globalErrorHandler');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1', pageRouter);

app.all('*', (req, res, next) => {
  next(new APIError('Route is not defined', 404));
});

app.use(globalErrorHandler);

module.exports = app;
