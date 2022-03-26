const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect(
  'mongodb+srv://ziynii:qorwl0523@cluster0.cbosi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useUnifiedTopology: true },
  function (error, client) {
    if (error) return console.log(error);

    db = client.db('todoapp');

    db.collection('post').insertOne(
      { 이름: 'John', _id: 20 },
      function (error, result) {
        console.log('저장완료');
      }
    );

    app.listen('8080', function () {
      console.log('listening on 8080');
    });
  }
);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/write.html');
});

app.post('/add', function (req, res) {
  res.send('전송완료');

  db.collection('post').insertOne(
    {
      title: req.body.title,
      date: req.body.date,
    },
    function (error, result) {
      console.log('저장완료2');
    }
  );
});
