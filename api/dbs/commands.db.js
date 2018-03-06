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
  keg.query = keg.formObjectIdQuery();
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
        .find(keg.query).toArray((err, findResult) => {
          if (err) reject(err);
          keg.findResult = findResult;
          resolve(keg);
        });
    });
  },
  insert: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .insert(keg.doc, (err, insertResult) => {
          if (err) reject(err);
          keg.insertResult = insertResult;
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
  deleteOne: (keg) => {
    return new Promise((resolve, reject) => {
      getCollection(keg)
        .deleteOne(keg.formObjectIdQuery(), (err, deleteOneResult) => {
          if (err) reject(err);
          keg.deleteOneResult = deleteOneResult;
          resolve(keg);
        });
    });
  },
  remove: (keg) => {
    return new Promise((resolve, reject) => {
      if (keg.query._id) keg = convertObjectIDs(keg);
      getCollection(keg)
        .remove(keg.query, (err, removeResult) => {
          if (err) reject(err);
          keg.removeResult = removeResult;
          resolve(keg);
        });
    });
  }
};

module.exports = dbOperationCommands;
