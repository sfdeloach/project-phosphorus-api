const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'phosphorus';
const collection = 'episodes';

let getDb = (url) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) reject(err);
      else resolve(client.db(dbName));
    });
  });
};

let find = (db, collection, query) => {
  return new Promise((resolve, reject) => {
    if (!query) query = {};
    db.collection(collection).find(query).toArray((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// middleware logger used only inside this route
router.use(function timeLog(req, res, next) {
  'use strict';
  console.log(`${new Date().toISOString()} - ${req.method} ${req.hostname}${req.baseUrl}`);
  next();
});

router.get('/promise2', function (req, res) {
  let query = {};
  if (req.body.query) query = req.body.query;
  getDb(url)
    .then(db => find(db, collection, { "call.eventNbr": 20172870575 }))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.json(err);
    });
});

router.get('/', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.error(err);
      res.json({
        'isOkay': false,
        'message': 'unable to connect to db',
        'num': 0
      });
    } else {
      const db = client.db(dbName);
      db.collection(episodesCollection).find().toArray(function (err, result) {
        if (err) {
          console.error(err);
          res.json({
            'isOkay': false,
            'message': dbErrorMessage,
            'num': 0
          });
        } else {
          res.json(result);
        }
      });
    }
  });
});

router.post('/new-one', function (req, res) {
  const episode = req.body.episode;

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        'isOkay': false,
        'message': noConnectMessage,
        'num': 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection(episodesCollection).insert(episode, function (err, result) {
        const successInsertMessage = `Event ${episode.call.eventNbr} added`;
        console.log(`${new Date()} - ` + successInsertMessage);
        res.json({
          'isOkay': true,
          'message': successInsertMessage,
          'num': `${result.insertedCount}`
        });
      });
    }
  });
});

router.post('/new-many', function (req, res) {
  const episodes = req.body.episodes;

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        'isOkay': false,
        'message': noConnectMessage,
        'num': 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection(episodesCollection).insertMany(episodes,
        function (err, result) {
          const successInsertMessage = `${episodes.length} episodes added`;
          console.log(`${new Date()} - ` + successInsertMessage);
          res.json({
            'isOkay': true,
            'message': successInsertMessage,
            'num': `${result.insertedCount}`
          });
        });
    }
  });
});

router.put('/:id', function (req, res) {
  const id = req.params.id;
  const episode = req.body.episode;

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        'isOkay': false,
        'message': noConnectMessage,
        'num': 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection(episodesCollection).deleteOne({
        _id: new mongodb.ObjectID(id)
      }, function (err, result) {
        db.collection(episodesCollection).insert(episode,
          function (err, result) {
            const successInsertMessage =
              `Event ${episode.call.eventNbr} updated`;
            console.log(`${new Date()} - ` + successInsertMessage);
            res.json({
              'isOkay': true,
              'message': successInsertMessage,
              'num': 1
            });
          });
      });
    }
  });
});

module.exports = router;
