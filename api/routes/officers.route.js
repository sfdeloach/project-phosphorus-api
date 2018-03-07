const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/log.utility');

const ErrJsonRes = require('../models/error.response.model.js');
const Keg = require('../models/keg.model');
let keg;

router.use((req, res, next) => {
  logger.request(req);
  keg = new Keg('officers');
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
