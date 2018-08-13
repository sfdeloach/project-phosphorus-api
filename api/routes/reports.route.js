const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/logger.utility');

const ErrJsonRes = require('../models/error.response.model.js');
const Keg = require('../models/keg.model');
let keg;

router.use((req, res, next) => {
  logger.request(req);
  keg = new Keg('reports');
  next();
});

/* Read - GET ***************************************************************/

/*
  api/reports/
  return all reports based on req.body.query (defaults {})
  ** NOT TESTED **
*/
router.get('/', (req, res) => {
  keg.query = req.body.query || {};
  command
    .connect(keg)
    .then(keg => command.find(keg))
    .then(keg => res.json(keg.findResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(logger.message(req), err, keg));
    });
});

/* Create - POST **************************************************************/

/*
  api/reports/
  insert one or many reports, reports must be an array
  ** NOT TESTED **
*/
router.post('/', (req, res) => {
  keg.documents = req.body.reports;
  command
    .connect(keg)
    .then(keg => command.insertMany(keg))
    .then(keg => res.json(keg.insertManyResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(logger.message(req), err, keg));
    });
});

/* Create - DELETE ************************************************************/

/*
  api/reports/
  deletes reports matching query, defaults to {} if query not provided
  ** NOT TESTED **
*/
router.delete('/', (req, res) => {
  keg.query = req.body.query || {};
  command
    .connect(keg)
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(logger.message(req), err, keg));
    });
});

/*
  api/reports/:id
  delete one officer by :id = officer._id
  ** NOT TESTED **
*/
router.delete('/:id', (req, res) => {
  keg
    .formQuery(req.params.id, req, res)
    .then(() => command.connect(keg))
    .then(keg => command.remove(keg))
    .then(keg => res.json(keg.removeResult))
    .catch(err => {
      delete keg.client;
      logger.reportError(err);
      res.json(new ErrJsonRes(logger.message(req), err, keg));
    });
});

module.exports = router;
