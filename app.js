var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const beverages = require('./routes/beverages');
const administrators = require('./routes/administrators');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/beverages', beverages.findAll);
app.get('/beverages/findById/:id', beverages.findOne);
app.get('/beverages/findByType/:type', beverages.findByCategory);
app.get('/beverages/findByName_fuzzy/:fname',beverages.findByNameFuzzy);
app.post('/beverages/addRecord', beverages.addRecord);
app.put('/beverages/addAmount/:id', beverages.incrementAmount);
app.put('/beverages/changePrice/:id',beverages.changePrice);
app.delete('/beverages/deleteById/:id', beverages.deleteRecord);
app.delete('/beverages/deleteByName/:name',beverages.deleteByName);


app.get('/administrators', administrators.findAll);
app.get('/administrators/findById/:id', administrators.findOne);
app.post('/administrators/login',administrators.login);
app.post('/administrators/addRecord', administrators.addRecord);
app.delete('/administrators/deleteById/:id', administrators.deleteRecord);


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
