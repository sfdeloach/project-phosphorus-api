const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

let getCollection = (keg) => {
  return keg.client.db('phosphorus')
    .collection(keg.collection);
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
      keg.convertIdToObject();
      getCollection(keg)
        .find(keg.query).toArray((err, findResult) => {
          if (err) reject(err);
          keg.findResult = findResult;
          resolve(keg);
        });
    });
  },
  insertMany: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .insertMany(keg.documents, (err, insertManyResult) => {
          if (err) reject(err);
          keg.insertManyResult = insertManyResult;
          resolve(keg);
        });
    });
  },
  replaceOne: (keg) => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg)
        .replaceOne(keg.query, keg.doc, (err, replaceOneResult) => {
          if (err) reject(err);
          keg.replaceOneResult = replaceOneResult;
          resolve(keg);
        });
    });
  },
  remove: (keg) => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg)
        .remove(keg.query, (err, removeResult) => {
          if (err) reject(err);
          keg.removeResult = removeResult;
          resolve(keg);
        });
    });
  },
  update: (keg) => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg)
        .update(keg.query, keg.doc, (err, updateResult) => {
          if (err) reject(err);
          keg.updateResult = updateResult;
          resolve(keg);
        });
    });
  }
};

module.exports = dbOperationCommands;