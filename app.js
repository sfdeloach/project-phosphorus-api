const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();

const dbName = 'phosphorus';
const collectionName = 'events';
const url = 'mongodb://localhost:27017';

// TODO remove after testing:
const testArray = [
  { name:
    { first: 'Bob',
      last: "Harrison"
    },
    id: 100600
  },
  { name:
    { first: 'Terry',
      last: "Young"
    },
    id: 100601
  }
];

app.use(bodyParser.json({
  limit: '20mb'
}));

app.get('/api/events', (req, res) => {
  console.log(`${new Date()} - GET /api/events request received`);

  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    const db = client.db(dbName);

    db.collection('events').find().toArray(function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });
});

app.post('/api/events', (req, res) => {
  const payload = req.body

  console.log(`${new Date()} - POST /api/events request received`);
  console.log(`${new Date()} - ${payload.length} documents in the payload`);

  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(`${new Date()} - Unable to connect to database`);
      res.json({
        "error": true,
        "message": 'Unable to connect to database',
        "lines": 0
      });
    } else {
      console.log(`${new Date()} - Successful connection to db ${dbName}`);
      const db = client.db(dbName);

      db.collection('events').insertMany(payload, (err, result) => {
        assert.equal(null, err);
        console.log(`${new Date()} - ${result.insertedCount} documents added to ${collectionName}`);
        res.json({
          "error": false,
          "message": `SERVER: ${result.insertedCount} documents received`,
          "lines": `${result.insertedCount}`
        });
      });
    }
  });

});

app.listen(3000, () => console.log(`${new Date()} - Phosphorus API listening on port 3000!`));
