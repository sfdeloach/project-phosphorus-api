const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

let collection = client => client.db('phosphorus').collection('episodes');
let documentID = id => {
  return { '_id': new mongodb.ObjectID(id) };
};

let episodeCollectionOperations = {
  connect: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) reject(err);
        else resolve({ 'client': client, 'result': null });
      });
    });
  },
  find: (client, query) => {
    return new Promise((resolve, reject) => {
      if (!query) query = {};
      collection(client).find(query).toArray((err, result) => {
        if (err) reject(err);
        else resolve({ 'client': client, 'result': result });
      });
    });
  },
  insertMany: (client, episodes) => {
    return new Promise((resolve, reject) => {
      collection(client).insertMany(episodes, (err, result) => {
        if (err) reject(err);
        else resolve({ 'client': client, 'result': result });
      });
    });
  },
  deleteOne: (client, id) => {
    return new Promise((resolve, reject) => {
      collection(client).deleteOne(documentID(id), (err, result) => {
        if (err) reject(err);
        else resolve({ 'client': client, 'result': result });
      });
    });
  },
  insert: (client, episode) => {
    return new Promise((resolve, reject) => {
      collection(client).insert(episode, (err, result) => {
        if (err) reject(err);
        else resolve({ 'client': client, 'result': result });
      });
    });
  }
};

module.exports = episodeCollectionOperations;
