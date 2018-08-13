const express = require('express');
const router = express.Router();

const command = require('../dbs/commands.db');
const logger = require('../assets/logger.utility');

const ErrJsonRes = require('../models/error.response.model.js');
const Keg = require('../models/keg.model');
let keg;

router.use((req, res, next) => {
  logger.request(req);
  keg = new Keg('users');
  next();
});

//

module.exports = router;
