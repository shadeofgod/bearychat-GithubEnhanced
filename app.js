const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql =  require('mysql');
const createHubot = require('./middlewares/hubot');
const debug = require('debug')('bearychat-githubenhanced:app.js');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  HUBOT_TOKEN,
} = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

debug('created mysql pool')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// bind db
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use(createHubot(HUBOT_TOKEN));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
