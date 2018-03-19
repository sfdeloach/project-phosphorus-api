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

/* Read - GET ***************************************************************/

/*
  api/officers/
  return all officers based on req.body.query (defaults {})
  TEST #53 and TODO test query
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
  api/officers/:id
  return one officer by :id = officer._id
  NOT TESTED
*/
router.get('/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/squad/:squad
  return all officers assigned to :squad
  NOT TESTED
*/
router.get('/squad/:squad', (req, res) => {
  keg.setQueryById(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/* Create - POST **************************************************************/

/*
  api/officers/
  insert one or many officers, officers must be an array
  TEST #51 and TEST #52
*/
router.post('/', (req, res) => {
  keg.documents = req.body.officers;
  command.connect(keg)
    .then(keg => command.insertMany(keg))
    .then(keg => res.json(keg.insertManyResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/* Create - PUT ***************************************************************/

/*
  api/officers/:id
  replace one officer by :id = officer._id
  NOT TESTED
*/
router.put('/:id', (req, res) => {
  keg.doc = req.body.officer;
  keg.setQueryById(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.replaceOne(keg))
    .then(keg => res.json(keg.replaceOneResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/deptID/:deptID
  replace one officer by officer.deptID
  NOT TESTED
*/
router.put('/deptID/:deptID', (req, res) => {
  keg.doc = req.body.officer;
  keg.setQueryById(req.params.id, req, res) // TODO: fix
    .then(() => command.connect(keg))
    .then(keg => command.replaceOne(keg))
    .then(keg => res.json(keg.replaceOneResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/* Create - DELETE ************************************************************/

/*
  api/officers/
  deletes officers matching query, defaults to {} if query not provided
  TEST #50 and ??? TODO: query test
*/
router.delete('/', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/:id
  delete one officer by :id = officer._id
  NOT TESTED
*/
router.delete('/:id', (req, res) => {
  keg.setQueryById(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/deptID/:deptID
  delete one officer by deptID
  NOT TESTED
*/
router.delete('/deptID/:deptID', (req, res) => {
  keg.setQueryById(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

module.exports = router;
