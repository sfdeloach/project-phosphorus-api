const ErrJsonRes = require('./error.response.model.js');
const logger = require('../assets/log.utility');

/*
  A 'Keg' object holds a number of properties useful in database operations,
  such as a client object, collection name, and operation parameters such as
  document IDs and documents (both single objects and arrays).
*/

class Keg {
  constructor(collection) {
    this.collection = collection;
    this.ObjectID = require('mongodb').ObjectID;
  }

  /*
    sets query from a parameter that is either an event number or object ID
  */
  setQueryById(parameter, req, res) {
    if (parameter.length === 11 &&
      /^[0-9]+$/g.test(parameter)) {
      this.query = { 'call.eventNbr': +parameter };
    } else if (parameter.length === 24 &&
      /^[a-fA-F0-9]+$/g.test(parameter)) {
      this.query = { '_id': parameter };
    } else {
      this.query = undefined;
      res.json(new ErrJsonRes(
        logger.message(req), "parameter must be an ObjectID or eventNbr", this
      ));
    }
    return;
  }

  /*
    accepts either a single ID or an array of IDs
  */
  convertIdToObject() {
    if (this.query._id) {
      let mongoObjectIDs = [];
      if (Array.isArray(this.query._id)) {
        this.query._id.forEach(id => {
          mongoObjectIDs.push(this.ObjectID(id));
        });
      } else if (typeof this.query._id === 'string') {
        mongoObjectIDs.push(this.ObjectID(this.query._id));
      }
      this.query = { '_id': { '$in': mongoObjectIDs } };
    }
    return;
  }
}

module.exports = Keg;
