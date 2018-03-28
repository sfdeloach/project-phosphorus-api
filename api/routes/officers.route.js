const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/logger.utility');

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
  TEST #53 and #59
*/
router.get('/', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/:id
  return one officer by :id = officer._id
  TEST #55
*/
router.get('/:id', (req, res) => {
  keg.formQuery(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/squad/:squad
  return all officers assigned to :squad
  TEST #60
*/
router.get('/squad/:squad', (req, res) => {
  keg.formQuery(req.params.squad, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      delete keg.client;
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
  TEST #51, #52, and #54
*/
router.post('/', (req, res) => {
  keg.documents = req.body.officers;
  command.connect(keg)
    .then(keg => command.insertMany(keg))
    .then(keg => res.json(keg.insertManyResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/* Create - PUT ***************************************************************/

/*
  api/officers/include
  update the include boolean for every officer based on squad
  NOT TESTED
*/
router.put('/include', (req, res) => {
  keg.query = req.body.query;
  keg.doc = req.body.update;
  command.connect(keg)
    .then(keg => command.update(keg))
    .then(keg => res.json(keg.updateResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/:id
  replace one officer by :id = officer._id
  TEST #56
*/
router.put('/:id', (req, res) => {
  keg.doc = req.body.officer;
  keg.formQuery(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.replaceOne(keg))
    .then(keg => res.json(keg.replaceOneResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/deptID/:deptID
  replace one officer by officer.deptID
  TEST #57
*/
router.put('/deptID/:deptID', (req, res) => {
  keg.doc = req.body.officer;
  keg.formQuery(req.params.deptID, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.replaceOne(keg))
    .then(keg => res.json(keg.replaceOneResult))
    .catch(err => {
      delete keg.client;
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
  TEST #50 and #63
*/
router.delete('/', (req, res) => {
  keg.query = req.body.query || {};
  command.connect(keg)
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/:id
  delete one officer by :id = officer._id
  TEST #61
*/
router.delete('/:id', (req, res) => {
  keg.formQuery(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

/*
  api/officers/deptID/:deptID
  delete one officer by deptID
  TEST #62
*/
router.delete('/deptID/:deptID', (req, res) => {
  keg.formQuery(req.params.deptID, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(
        logger.message(req), err, keg
      ));
    });
});

module.exports = router;
