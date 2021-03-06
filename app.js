const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();

const episodes = require('./api/routes/episodes.route');
const officers = require('./api/routes/officers.route');
const reports = require('./api/routes/reports.route');
const users = require('./api/routes/users.route');

const logger = require('./api/assets/logger.utility');
const ErrJsonRes = require('./api/models/error.response.model.js');
const Keg = require('./api/models/keg.model.js');

app.use(bodyParser.json({
  limit: '20mb'
}));

// Allow CORS on ExpressJS TODO: remove after testing?
app.use(function (req, res, next) {
  'use strict';
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Routing configuration
app.use('/api/episodes', episodes);
app.use('/api/officers', officers);
app.use('/api/reports', reports);
app.use('/api/users', users);

// Wildcard route
app.all('/*', (req, res) => {
  logger.request(req);
  logger.reportError('app route not found');
  keg = new Keg('not found');
  res.json(new ErrJsonRes(
    logger.message(req), new Error('app route not found'), keg
  ));
});

app.listen(3000, () => {
  logger.startup();
});
