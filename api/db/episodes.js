const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'phosphorus';
const collection = 'episodes';

let databaseFunctions = {
  connect: (url) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) reject(err);
        else resolve(client.db(dbName));
      });
    });
  },
  find: (db, collection, query) => {
    return new Promise((resolve, reject) => {
      if (!query) query = {};
      db.collection(collection).find(query).toArray((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  insertMany: (db, collection, episodes) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).insertMany(episodes, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

module.exports = databaseFunctions;
