const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/log.utility');

const ErrJsonRes = require('../models/error.response.model.js');
const Keg = require('../models/keg.model');
let keg;

router.use((req, res, next) => {
  logger.request(req);
  keg = new Keg('episodes');
  next();
});

// return all episodes
router.get('/', (req, res, next) => {
  keg.query = {};
  command.connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

// return one episode
router.get('/findOne/:id', (req, res) => {
  keg.documentIDs = req.params.id;
  command.connect(keg)
    .then(keg => command.findOne(keg))
    .then(keg => res.json(keg.findOneResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });

});

// return the results of a query object
router.post('/find', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

// insert one episode
router.post('/insert', (req, res) => {
  keg.doc = req.body.episode;
  command.connect(keg)
    .then(keg => command.insert(keg))
    .then(keg => res.json(keg.insertResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

// insert an array of episodes
router.post('/insert-many', (req, res) => {
  keg.documents = req.body.episodes;
  command.connect(keg)
    .then(keg => command.insertMany(keg))
    .then(keg => res.json(keg.insertManyResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

router.put('/replace-one', (req, res) => {
  // TODO
});

// remove one episode and insert a new episode
// used when the replacement document length does
// not match original document
router.put('/delete-one-and-insert/:id', (req, res) => {
  keg.documentID = req.params.id;
  keg.doc = req.body.episode;
  command.connect(keg)
    .then(keg => command.deleteOne(keg))
    .then(keg => command.insert(keg))
    .then(keg => res.json([
      keg.deleteOneResult,
      keg.insertResult
    ]))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

// remove one episode
router.delete('/delete-one/:id', (req, res) => {
  keg.documentIDs = req.params.id;
  command.connect(keg)
    .then(keg => command.deleteOne(keg))
    .then(keg => res.json(keg.deleteOneResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

// remove episodes matching the provided query
router.delete('/query-remove', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

module.exports = router;
