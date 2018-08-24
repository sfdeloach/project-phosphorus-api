const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const argon2 = require('argon2');

let getCollection = keg => {
  return keg.client.db('phosphorus').collection(keg.collection);
};

let dbOperationCommands = {
  connect: keg => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        (err, client) => {
          if (err) reject(err);
          keg.client = client;
          resolve(keg);
        }
      );
    });
  },
  find: keg => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg)
        .find(keg.query)
        .toArray((err, findResult) => {
          if (err) reject(err);
          keg.findResult = findResult;
          resolve(keg);
        });
    });
  },
  insertMany: keg => {
    return new Promise((resolve, reject) => {
      if (!keg.documents) reject(new Error('nothing to insert'));
      getCollection(keg).insertMany(keg.documents, (err, insertManyResult) => {
        if (err) reject(err);
        keg.insertManyResult = insertManyResult;
        resolve(keg);
      });
    });
  },
  replaceOne: keg => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg).replaceOne(keg.query, keg.doc, (err, replaceOneResult) => {
        if (err) reject(err);
        keg.replaceOneResult = replaceOneResult;
        resolve(keg);
      });
    });
  },
  remove: keg => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg).remove(keg.query, (err, removeResult) => {
        if (err) reject(err);
        keg.removeResult = removeResult;
        resolve(keg);
      });
    });
  },
  update: keg => {
    return new Promise((resolve, reject) => {
      keg.convertIdToObject();
      getCollection(keg).update(keg.query, keg.doc, { multi: true }, (err, updateResult) => {
        if (err) reject(err);
        keg.updateResult = updateResult;
        resolve(keg);
      });
    });
  },
  verifyUser: keg => {
    return new Promise((resolve, reject) => {
      getCollection(keg).findOne(
        {
          username: keg.user.username
        },
        (err, findResult) => {
          if (err) {
            reject(err);
          } else if (findResult) {
            argon2.verify(findResult.password, keg.user.password).then(match => {
              if (match) {
                keg.findResult = findResult;
                resolve(keg);
              } else {
                keg.findResult = undefined;
                resolve(keg);
              }
            });
          } else {
            keg.findResult = undefined;
            resolve(keg);
          }
        }
      );
    });
  },
  createUser: keg => {
    return new Promise((resolve, reject) => {
      const hashOptions = {
        timeCost: 4,
        memoryCost: 2 ** 14,
        parallelism: 2,
        type: argon2.argon2id
      };
      argon2
        .hash(keg.user.password, hashOptions)
        .then(hash => {
          keg.user.password = hash;
          getCollection(keg).insertOne(keg.user, (err, insertOneResult) => {
            if (err) reject(err);
            keg.insertOneResult = insertOneResult;
            resolve(keg);
          });
        })
        .catch(err => {
          console.error('A problem occurred during argon2 hash.');
          console.error(err);
          reject(err);
        });
    });
  }
};

module.exports = dbOperationCommands;
