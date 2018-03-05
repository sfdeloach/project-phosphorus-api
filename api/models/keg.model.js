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

  // accepts either a single ID or an array of IDs
  formObjectIdQuery() {
    let mongoObjectIDs = [];

    if (Array.isArray(this.documentIDs)) {
      this.documentIDs.forEach(id => {
        mongoObjectIDs.push(this.ObjectID(id));
      });
    } else if (typeof this.documentIDs === 'string') {
      mongoObjectIDs.push(this.ObjectID(this.documentIDs));
    }

    return { '_id': { $in: mongoObjectIDs }};
  }
}

module.exports = Keg;
