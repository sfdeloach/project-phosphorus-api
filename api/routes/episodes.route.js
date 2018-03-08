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

// Read - GET //////////////////////////////////////////////////////////////////
// api/episodes/ - return all episodes based on req.body.query (defaults {})
router.get('/', (req, res) => {
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

// api/episodes/call/:eventNbr - return one call by :eventNbr = call.eventNbr
router.get('/call/:eventNbr', (req, res) => {
  keg.query = { 'call.eventNbr': +req.params.eventNbr };
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

// api/episodes/report/:id - find report by :id = report.caseNbr

// api/episodes/:id - return one episode by :id = episode.ObID or call.eventNbr

// Create - POST ///////////////////////////////////////////////////////////////
// api/episodes/ - insert one or many episodes
router.post('/', (req, res) => {
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

// api/episodes/call/units/:id - insert one unit on :id = episode.ObID or call.eventNbr

// api/episodes/report/:id - insert one report on :id = episode.ObID or call.eventNbr

// Update - PUT ////////////////////////////////////////////////////////////////
// api/episodes/:id - update one episode by :id = episode.ObID or call.eventNbr
router.put('/:id', (req, res) => {
  keg.document = req.body.episode;
  command.connect(keg)
  .then(keg => command.replaceOne(keg))
  .then(keg => res.json(keg.replaceOneResult))
  .catch(err => {
    console.error(err);
    res.json(new ErrJsonRes(
      logger.message(req), err, keg
    ));
  });
});

// Delete - DELETE /////////////////////////////////////////////////////////////
// api/episodes/ - deletes all episodes
router.delete('/', (req, res) => {
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

// api/episodes/call/units/:id - delete one unit by :id = officer.ObID or officer.deptID

// api/episodes/report/:id - delete one report by :id = report.caseNbr

// api/episodes/:id - delete one episode by :id = episode.ObID or call.eventNbr

module.exports = router;
