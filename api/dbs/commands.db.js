const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

let getCollection = (keg) => {
  const client = keg.client;
  const collection = keg.collection;
  return client.db('phosphorus').collection(collection);
};

let convertObjectIDs = (keg) => {
  keg.documentIDs = keg.query._id;
  keg.query = keg.getObjectIDs();
  return keg;
};

let dbOperationCommands = {
  connect: (keg) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) reject(err);
        keg.client = client;
        resolve(keg);
      });
    });
  },
  find: (keg) => {
    return new Promise((resolve, reject) => {
      if (keg.query._id) keg = convertObjectIDs(keg);
      getCollection(keg)
        .find(keg.query).toArray((err, queryResults) => {
          if (err) reject(err);
          keg.queryResults = queryResults;
          resolve(keg);
        });
    });
  },
  insert: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .insert(keg.doc, (err, result) => {
          if (err) reject(err);
          keg.result = result;
          resolve(keg);
        });
    });
  },
  insertMany: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .insertMany(keg.documents, (err, result) => {
          if (err) reject(err);
          keg.result = result;
          resolve(keg);
        });
    });
  },
  deleteOne: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .deleteOne(keg.getObjectID(), (err, result) => {
          if (err) reject(err);
          if (result.result.n === 0) {
            keg.message = `document with '_id:' ${keg.documentID} not found`;
            reject(keg);
          }
          keg.result = result;
          resolve(keg);
        });
    });
  },
  remove: (keg) => {
    return new Promise((resolve, reject) => {
      if (keg.query._id) keg = convertObjectIDs(keg);
      getCollection(keg)
        .remove(keg.query, (err, queryResults) => {
          if (err) reject(err);
          keg.queryResults = queryResults.result;
          resolve(keg);
        });
    });
  }
};

module.exports = dbOperationCommands;
