const express = require('express');
const router = express.Router();
const Result = require('../models/result.model');
const database = require('../dbs/commands.db');
const log = require('../assets/log.utility');

router.use(function timeLog(req, res, next) {
  'use strict';
  log.request(req);
  next();
});

router.get('/', (req, res) => {
  database.connect()
    .then(resolution => database.find(resolution.client))
    .then(resolution => res.json(resolution.result))
    .catch(err => {
      log.error(err);
      res.json(new Result(err));
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  database.connect()
    .then(resolution => database.findOne(resolution.client))
    .then(resolution => res.json(resolution.result))
    .catch(err => {
      log.error(err);
      res.json(new Result(err));
    });
});

router.post('/new', (req, res) => {
  const officer = req.body.officer;
  database.connect()
    .then(resolution => database.insert(resolution.client, officer))
    .then(resolution => res.json(new Result(
      null, 'new officer created', newOfficer.deptID
    )))
    .catch(err => {
      log.error(err);
      res.json(new Result(err));
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  database.connect()
    .then(resolution => database.replaceOne(resolution.client, id))
    .then(resolution => res.json(new Result(
      null, 'officer updated', newOfficer.deptID
    )))
    .catch(err => {
      log.error(err);
      res.json(new Result(err));
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  database.connect()
    .then(resolution => database.deleteOne(resolution.client, id))
    .then(resolution => res.json(new Result(
      null, 'officer removed'
    )))
    .catch(err => {
      log.error(err);
      res.json(new Result(err));
    });
});

module.exports = router;
