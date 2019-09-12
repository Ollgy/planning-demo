require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

global.NODE_PATH = __dirname;

require('./db'); 

const pos = require('./positions');
pos.addPosToBD(pos.posList);

const head = require('./head');
head.addHeadToBD(head.user);

const app = express();

app.use(bodyParser.json());

app.use(cookieParser('secret'));
app.use(session({ 
  key: 'session-key',
  cookie: {
    path: '/',
    httpOnly: true,
    secure : false,
    maxAge: 600000 
  },
  secret: 'secret',
  resave: true,
  ephemeral: true,
  rolling: true,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname + '/build'), { index: false } ));

require('./passport/config-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', (require('./routes/index')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('Not Found');
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.sendStatus(err.status);
});

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});