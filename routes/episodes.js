const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const dbName = 'phosphorus';
const episodesCollection = 'episodes';
const url = 'mongodb://localhost:27017';

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  'use strict';
  console.log(`${new Date()} - ${req.method} ${req.hostname}${req.baseUrl}`);
  next();
});

// connect().then(checkForError)
//   .then(executeRequest)
//   .then(checkForError)
//   .then(provideResponse)

// let checkForError = () => {};

router.get('/', function(req, res) {
  'use strict';

  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      console.log(err);
      res.json({
        'isOkay': false,
        'message': noConnectMessage,
        'num': 0
      });
    } else {
      const db = client.db(dbName);
      db.collection(episodesCollection).find().toArray(function(err, result) {
        if (err) {
          console.log(`${new Date()} - ` + dbErrorMessage);
          console.log(err);
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

router.post('/new-one', function(req, res) {
  'use strict';
  const episode = req.body.episode;

  MongoClient.connect(url, function(err, client) {
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

      db.collection(episodesCollection).insert(episode, function(err, result) {
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

router.post('/new-many', function(req, res) {
  'use strict';
  const episodes = req.body.episodes;

  MongoClient.connect(url, function(err, client) {
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
        function(err, result) {
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

router.put('/:id', function(req, res) {
  'use strict';
  const id = req.params.id;
  const episode = req.body.episode;

  MongoClient.connect(url, function(err, client) {
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
      }, function(err, result) {
        db.collection(episodesCollection).insert(episode,
          function(err, result) {
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
