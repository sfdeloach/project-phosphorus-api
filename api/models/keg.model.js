const ErrJsonRes = require('./error.response.model.js');
const logger = require('../assets/logger.utility');

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
  formQuery(parameter, req, res) {
    return new Promise((resolve, reject) => {
      if (parameter.length === 11 &&
        /^[0-9]+$/g.test(parameter)) {
        this.query = {
          'call.eventNbr': +parameter
        };
      } else if (parameter.length === 24 &&
        /^[a-fA-F0-9]+$/g.test(parameter)) {
        this.query = {
          '_id': parameter
        };
      } else if (parameter.length === 3 &&
        /^[0-9]+$/g.test(parameter)) {
        this.query = {
          'deptID': +parameter
        };
      } else if (parameter.length === 1 &&
        /[a-dgs-u]/g.test(parameter)) {
        this.query = {
          'squad': this.getSquad(parameter)
        };
      } else {
        this.query = 'malformed';
        reject(new Error(`unable to form a query, the parameter '${parameter}'` +
          ` is not an event, objectID, deptID, or squad`));
      }
      resolve();
    });
  }

  /*
    accepts either a single ID or an array of IDs
  */
  convertIdToObject() {
    if (this.query && this.query._id) {
      let mongoObjectIDs = [];
      if (Array.isArray(this.query._id)) {
        this.query._id.forEach(id => {
          mongoObjectIDs.push(this.ObjectID(id));
        });
      } else if (typeof this.query._id === 'string') {
        mongoObjectIDs.push(this.ObjectID(this.query._id));
      }
      this.query = {
        '_id': {
          '$in': mongoObjectIDs
        }
      };
    }
    return;
  }

  getSquad(letter) {
    const phonetics = {
      a: 'Alpha',
      b: 'Bravo',
      c: 'Charlie',
      d: 'Delta',
      g: 'Uptown/Gateway',
      s: 'Street Crimes',
      t: 'Traffic',
      u: 'Uptown/Gateway'
    };
    return phonetics[letter];
  }
}

module.exports = Keg;
