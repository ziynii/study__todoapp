const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect(
  'mongodb+srv://ziynii:qorwl0523@cluster0.cbosi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useUnifiedTopology: true },
  function (error, client) {
    if (error) return console.log(error);

    db = client.db('todoapp');

    app.listen('8080', function () {
      console.log('listening on 8080');
    });
  }
);

app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.get('/write', function (req, res) {
  res.render('write.ejs');
});

app.post('/add', function (req, res) {
  db.collection('counter').findOne(
    { name: '게시물갯수' },
    function (error, result) {
      let 총게시물갯수 = result.totalPost;

      db.collection('post').insertOne(
        {
          _id: 총게시물갯수 + 1,
          title: req.body.title,
          date: req.body.date,
        },
        function (error, result) {
          console.log('저장완료');
          res.send('전송완료');

          // counter에 있는 totalPost 1증가 (수정)
          db.collection('counter').updateOne(
            { name: '게시물갯수' },
            { $inc: { totalPost: 1 } }
          );
        }
      );
    }
  );
});

app.get('/list', function (req, res) {
  db.collection('post')
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render('list.ejs', { posts: result });
    });
});

app.delete('/delete', function (req, res) {
  req.body._id = parseInt(req.body._id);
  db.collection('post').deleteOne(req.body, function (error, result) {
    console.log('삭제완료');
    res.status(200).send({ message: '성공했습니다' });
  });
});

app.get('/detail/:id', function (req, res) {
  db.collection('post').findOne(
    { _id: parseInt(req.params.id) },
    function (error, result) {
      console.log(result);

      res.render('detail.ejs', { data: result });
    }
  );
});
