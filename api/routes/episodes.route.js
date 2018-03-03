const express = require('express');
const router = express.Router();
const Result = require('../models/result.model');
const database = require('../dbs/episodes.db');

let ts = () => `${new Date().toISOString()} - `;
let reqInfo = req => req.method + ' ' + req.baseUrl + req.path;

router.use(function timeLog(req, res, next) {
  'use strict';
  console.log(ts() + reqInfo(req));
  next();
});

router.get('/', (req, res) => {
  let query = {};
  if (req.body.query) query = req.body.query;
  database.connect()
    .then(resolution => database.find(resolution.client, query))
    .then(resolution => res.json(resolution.result))
    .catch(err => {
      console.error(`${new Date().toISOString()} - ${err.message}`);
      res.json(new Result(err));
    });
});

router.post('/insert-many', (req, res) => {
  const episodes = req.body.episodes;
  database.connect()
    .then(resolution => database.insertMany(resolution.client, episodes))
    .then(resolution => res.json(new Result(
      null, 'episodes created', resolution.result.insertedCount
    )))
    .catch(err => {
      console.error(err.message);
      res.json(new Result(err));
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const episode = req.body.episode;
  database.connect()
    .then(resolution => database.deleteOne(resolution.client, id))
    .then(resolution => database.insert(resolution.client, episode))
    .then(resolution => res.json(new Result(null, 'episode updated')))
    .catch(err => {
      console.error(err.message);
      res.json(new Result(err));
    });
});

module.exports = router;
