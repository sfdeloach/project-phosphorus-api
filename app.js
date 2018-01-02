const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(bodyParser.json({ limit: '20mb' }));

app.get('/api/events', (req, res) => {
  console.log("received a GET request for /");

  MongoClient.connect('mongodb://localhost:27017/phosphorus', function (err, database) {
    if (err) throw err;
    const phosphorus = database.db('phosphorus');
    phosphorus.collection('events').find().toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });
});

app.post('/api/events', (req, res) => {
  console.log("POST request received");
  console.dir(req.body);
  res.json({ "message": "SERVER: payload received" });
});

app.listen(3000, () => console.log('Phosphorus API listening on port 3000!'));
