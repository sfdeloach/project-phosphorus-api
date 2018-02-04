const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();

const dbName = 'phosphorus';
const eventsCollection = 'events';
const officersCollection = 'officers';
const url = 'mongodb://localhost:27017';

const accessCodes = {
  alpha: '8uJ4eC1s^0iB5bR0',
  bravo: '6*3gdsaFhsT8fQux',
  charlie: 'n6Dk9Wv1Pc9Ym3Z&',
  delta: 'eD9k4#adsa1sXsQs'
};
const noConnectMessage = `Database is not online, unable to make a connection`;
const dbErrorMessage = `Was able to connect to database, however an error occurred during the operation`;

app.use(bodyParser.json({
  limit: '20mb'
}));

// Allow CORS on ExpressJS
app.use(function (req, res, next) {
  "use strict";
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Officer API starts here /////////////////////////////////////////////////////

app.get('/api/officers', function (req, res) {
  "use strict";
  console.log(`${new Date()} - GET /api/officers request received`);

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      console.log(err);
      res.json({
        "error": true,
        "message": noConnectMessage,
        "lines": 0
      });
    } else {
      const db = client.db(dbName);
      db.collection(officersCollection).find().toArray(function (err, result) {
        if (err) {
          console.log(`${new Date()} - ` + dbErrorMessage);
          console.log(err);
          res.json({
            "error": true,
            "message": dbErrorMessage,
            "lines": 0
          });
        } else {
          res.json(result);
        }
      });
    }
  });
});

app.get('/api/officers/:id', function (req, res) {
  "use strict";
  const id = req.params.id;
  console.log(`${new Date()} - GET /api/officers/${id} request received`);
  const errorOfc = {
    "name": {
      "last": "??? Unable to retrieve officer",
      "first": "??? Unable to retrieve officer"
    }
  };

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.error(err);
      res.json(errorOfc);
    } else {
      console.log(`${new Date()} - Successful connection to the database`);
      const db = client.db(dbName);
      console.log(`${new Date()} - Database client set to '${dbName}'`);
      db.collection(officersCollection).findOne({ _id: new mongodb.ObjectID(id) }, function (err, result) {
        if (err) {
          console.log(`${new Date()} - An error occurred during the 'findOne()' operation`);
          console.error(err);
          res.json(errorOfc);
        } else {
          console.log(`${new Date()} - Successful retrieval: ${result._id}`);
          res.json(result);
        }
      });
    }
  });

});

app.post('/api/officers/new', function (req, res) {
  "use strict";
  console.log(`${new Date()} - POST /api/officers/new request received`);

  const newOfficer = req.body.officer;

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        "error": true,
        "message": noConnectMessage,
        "lines": 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection(officersCollection).insert(newOfficer, function (err, result) {
        assert.equal(null, err);
        const successInsertMessage = `${result.insertedCount} officer added to ${officersCollection}`;
        console.log(`${new Date()} - ` + successInsertMessage);
        res.json({
          "error": false,
          "message": successInsertMessage,
          "lines": `${result.insertedCount}`
        });
      });
    }
  });
});

app.put('/api/officers/:id', function (req, res) {
  "use strict";
  const id = req.params.id;
  console.log(`${new Date()} - PUT /api/officers/${id} request received`);

  const updateOfc = req.body.officer;
  delete updateOfc._id; // must remove _id field or replaceOne() will fail

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        "error": true,
        "message": noConnectMessage,
        "lines": 0
      });
    } else {
      const db = client.db(dbName);

      db.collection(officersCollection).replaceOne({ _id: new mongodb.ObjectID(id) }, updateOfc,
        function (err, result) {
          if (err) {
            console.error("An error occurred during the replaceOne() operation!");
            console.error(err);
          } else {
            const successUpdateMessage = `Successful update of officer with id: ${updateOfc._id}`;
            console.log(`${new Date()} - ` + successUpdateMessage);
            res.json({
              "error": false,
              "message": successUpdateMessage,
              "lines": 1
            });
          }
        }
      );
    }
  });
});

app.delete('/api/officers/:id', function (req, res) {
  "use strict";
  const id = req.params.id;
  console.log(`${new Date()} - DELETE /api/officers/${id} request received`);

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      res.json({
        "error": true,
        "message": noConnectMessage,
        "lines": 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection(officersCollection).deleteOne({ _id: new mongodb.ObjectID(id) }, function (err, result) {
        assert.equal(null, err);
        const successDeleteMessage = `${result.deletedCount} officer deleted from ${officersCollection}`;
        console.log(`${new Date()} - ` + successDeleteMessage);
        res.json({
          "error": false,
          "message": successDeleteMessage,
          "lines": `${result.deletedCount}`
        });
      });
    }
  });
});

// Events API starts here //////////////////////////////////////////////////////

app.get('/api/events', function (req, res) {
  "use strict";
  console.log(`${new Date()} - GET /api/events request received`);

  MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log(`${new Date()} - ` + noConnectMessage);
      console.log(err);
      res.json({
        "error": true,
        "message": noConnectMessage,
        "lines": 0
      });
    } else {
      const db = client.db(dbName);

      db.collection(eventsCollection).find().toArray(function (err, result) {
        if (err) {
          console.log(`${new Date()} - ` + dbErrorMessage);
          console.log(err);
          res.json({
            "error": true,
            "message": dbErrorMessage,
            "lines": 0
          });
        } else {
          res.json(result);
        }
      });
    }
  });
});

app.post('/api/events', function (req, res) {
  "use strict";
  const passcode = req.body.passcode;
  const payload = req.body.payload;

  console.log(`${new Date()} - POST /api/events request received`);
  console.log(`${new Date()} - ${payload.length} documents in the payload`);

  if (passcode === accessCodes.alpha) {
    console.log(`${new Date()} - Proper passcode was provided, access to API granted`);
    MongoClient.connect(url, function (err, client) {
      if (err) {
        console.log(`${new Date()} - ` + noConnectMessage);
        res.json({
          "error": true,
          "message": noConnectMessage,
          "lines": 0
        });
      } else {
        console.log(`${new Date()} - Successful connection to db ${dbName}`);
        const db = client.db(dbName);

        db.collection(eventsCollection).insertMany(payload, function (err, result) {
          assert.equal(null, err);
          const successInsertMessage = `${result.insertedCount} documents added to ${eventsCollection}`;
          console.log(`${new Date()} - ` + successInsertMessage);
          res.json({
            "error": false,
            "message": successInsertMessage,
            "lines": `${result.insertedCount}`
          });
        });
      }
    });
  } else {
    const badPasscodeMessage = `Improper passcode provided, access to API denied`;
    console.log(`${new Date()} - ` + badPasscodeMessage);
    res.json({
      "error": true,
      "message": badPasscodeMessage,
      "lines": 0
    });
  }

});

app.listen(3000, () => console.log(`${new Date()} - Phosphorus API listening on port 3000!`));
