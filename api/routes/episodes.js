const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient; // TODO: remove after promise conversion

const database = require('../db/episodes');

const url = 'mongodb://localhost:27017'; // TODO: remove after promise conversion
const dbName = 'phosphorus'; // TODO: remove after promise conversion
const collection = 'episodes'; // TODO: remove after promise conversion

// middleware logger used only inside this route
router.use(function timeLog(req, res, next) {
  'use strict';
  console.log(`${new Date().toISOString()} - ${req.method} ${req.hostname}${req.baseUrl}`);
  next();
});

router.get('/', function (req, res) {
  let query = {};
  if (req.body.query) query = req.body.query;
  database.connect(url)
    .then(db => database.find(db, collection, query))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err.message);
      res.json(new Result(err));
    });
});

router.post('/new-many', function (req, res) {
  const episodes = req.body.episodes;
  database.connect(url)
    .then(db => database.insertMany(db, collection, episodes))
    .then(result => res.json(new Result(
      null,
      `${episodes.length} episodes added`,
      `${result.insertedCount}`)))
    .catch(err => {
      console.error(err.message);
      res.json(new Result(err));
    });
});

router.post('/new-many/old', function (req, res) {
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

      db.collection(collection).insertMany(episodes,
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

      db.collection(collection).insert(episode, function (err, result) {
        const successInsertMessage = `Event ${episode.call.eventNbr} added`;
        console.log(`${new Date()} - ` + successInsertMessage);
        res.json(new Result(null, new Date(), result.insertedCount));
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

      db.collection(collection).deleteOne({
        _id: new mongodb.ObjectID(id)
      }, function (err, result) {
        db.collection(collection).insert(episode,
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
