const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/log.utility');

const ErrJsonRes = require('../models/error.response.model.js');
const Keg = require('../models/keg.model');

let keg = new Keg('episodes');

router.use((req, res, next) => {
  logger.request(req);
  keg = new Keg('episodes');
  next();
});

/* Read - GET *****************************************************************/

/*
  api/episodes/
  return all episodes based on req.body.query (defaults {})
  TESTED
*/
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

/*
  api/episodes/call/created/:from.:to
  return episodes within a date range
  TESTED
*/
router.get('/call/created/:from.:to', (req, res) => {
  keg.query = {
    'call.created': {
      $gte: req.params.from + 'T00:00:00.000Z',
      $lt: req.params.to + 'T23:59:59.999Z'
    }
  };
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

/*
  api/episodes/call/eventNbr/:eventNbr
  return one episode by :eventNbr = call.eventNbr
  TESTED
*/
router.get('/call/eventNbr/:eventNbr', (req, res) => {
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

/*
  api/episodes/reports/caseNbr/:caseNbr
  find episode by :caseNbr = report.caseNbr
  TESTED
*/
router.get('/reports/caseNbr/:caseNbr', (req, res) => {
  keg.query = { 'reports.caseNbr': req.params.caseNbr };
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

/*
  api/episodes/call/primaryUnit/:primaryUnit
  find episodes by primaryUnit
  TESTED
*/
router.get('/call/primaryUnit/deptID/:deptID', (req, res) => {
  keg.query = { 'call.primaryUnit.deptID': +req.params.deptID };
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

/*
  api/episodes/:id
  return one episode by :id = episode.ObID
  TESTED
*/
router.get('/:id', (req, res) => {
  keg.query = { '_id': req.params.id };
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

/* Create - POST **************************************************************/

/*
  api/episodes/
  insert one or many episodes, episodes must be an array
  TESTED
*/
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

/*
  api/episodes/call/units/:id
  insert one unit on :id = episode.ObID or call.eventNbr
  TESTED
*/
router.post('/call/units/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res);
  keg.doc = { '$push': { 'call.units': req.body.officer } };
  command.connect(keg)
    .then(keg => command.update(keg))
    .then(keg => res.json(keg.updateResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/episodes/reports/:id
  insert one report on :id = episode.ObID or call.eventNbr
  TESTED
*/
router.post('/reports/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res);
  keg.doc = { '$push': { 'reports': req.body.report } };
  command.connect(keg)
    .then(keg => command.update(keg))
    .then(keg => res.json(keg.updateResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/* Update - PUT ***************************************************************/

/*
  api/episodes/:id
  replace one episode by :id = episode.ObID or call.eventNbr
  TESTED
*/
router.put('/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res);
  keg.doc = req.body.episode;
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

/* Delete - DELETE ************************************************************/

/*
  api/episodes/
  deletes episodes matching query, defaults to {} if query not provided
  TESTED
*/
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

/*
  api/episodes/call/units/:id
  delete one unit by :id = officer.ObID or officer.deptID
*/

/*
  api/episodes/reports/:caseNbr
  remove all reports that match :caseNbr = report.caseNbr
*/
router.delete('/reports/caseNbr/:caseNbr', (req, res) => {
  keg.query = { 'reports.caseNbr': req.params.caseNbr };
  keg.doc = { '$pull': { 'reports': { 'caseNbr': req.params.caseNbr } } };
  command.connect(keg)
    .then(keg => command.update(keg))
    .then(keg => res.json(keg.updateResult))
    .catch(err => {
      console.error(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/episodes/:id
  delete one episode by :id = episode.ObID or call.eventNbr
*/
router.delete('/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res);
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

/*
  api/episodes/call/created/:from.:to
  deletes all episodes within a date range
*/

module.exports = router;
