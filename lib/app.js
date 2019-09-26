const express = require('express');
const app = express();
require('../lib/models/register-plugins');

// middleware
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// test route
app.get('/hello', (req, res) => {
  res.send('hello express');
});

app.use(checkConnection);

// API ROUTES
const reviewers = require('./routes/reviewers');
app.use('/api/reviewers', reviewers);

// NOT FOUND
const api404 = require('./middleware/api-404');
app.use('/api', api404);

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;