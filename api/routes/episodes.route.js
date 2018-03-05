const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const log = require('../assets/log.utility');

const Keg = require('../models/keg.model');
let keg = new Keg('episodes');

router.use((req, res, next) => {
  log.request(req);
  next();
});

// return all episodes
router.get('/', (req, res) => {
  keg.query = {};
  command.connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      log.error(err);
      res.json(err);
    });
});

// return the results of a query object
router.put('/query-find', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      log.error(err);
      res.json(err);
    });
});

// insert one episode
router.post('/insert', (req, res) => {
  keg.doc = req.body.episode;
  command.connect(keg)
    .then(keg => command.insert(keg))
    .then(keg => res.json(keg.insertResult))
    .catch(err => {
      log.error(err);
      res.json(err);
    });
});

// insert an array of episodes
router.post('/insert-many', (req, res) => {
  keg.documents = req.body.episodes;
  command.connect(keg)
    .then(keg => command.insertMany(keg))
    .then(keg => res.json(keg.insertManyResult))
    .catch(err => {
      log.error(err);
      res.json(err);
    });
});

// remove episodes matching the provided query
router.put('/query-remove', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      log.error(err);
      res.json(err);
    });
});

// remove one episode
router.delete('/deleteOne/:id', (req, res) => {
  keg.documentIDs = req.params.id;
  command.connect(keg)
    .then(keg => command.deleteOne(keg))
    .then(keg => res.json(keg.deleteOneResult))
    .catch(err => {
      log.error(err);
      res.json({
        'name': 'deleteOneResult',
        'error': true,
        'message': `{ _id: ${keg.documentIDs} } is not in the database`
      });
    });
});

// remove one episode and insert a new episode
router.put('/replaceOne/:id', (req, res) => {
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
      log.error(err);
      res.json([{
        'name': 'deleteOneResult',
        'error': true,
        'message': `{ _id: ${keg.documentIDs} } is not in the database`
      }, {
        'name': 'insertResult',
        'error': true,
        'message': 'insert command failed due to deleteOne()'
      }
      ]);
    });
});

module.exports = router;
