var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const beverages = require('./routes/beverages');
const administrators = require('./routes/administrators');
const comments = require('./routes/comments');
var mongoose = require('mongoose')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use("*", function (req,res,next) {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Content-Type,Content-Length,Authorization,Accept,X-Requested-With,token');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers','token');

  if (req.method === 'OPTIONS')
    res.send(200);
  else
    next()
})
*/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors());

app.get('/beverages', beverages.findAll);
app.get('/beverages/findById/:id', beverages.findOne);
app.get('/beverages/findByType/:type', beverages.findByCategory);
app.get('/beverages/findByName_fuzzy/:fname',beverages.findByNameFuzzy);
app.post('/beverages/addRecord', beverages.addRecord);
app.put('/beverages/addAmount/:id', beverages.incrementAmount);
app.put('/beverages/changePrice/:id',beverages.changePrice);
app.put('/beverages/update/:id',beverages.updateBeverage);
app.delete('/beverages/deleteById/:id', beverages.deleteRecord);
app.delete('/beverages/deleteByName/:name',beverages.deleteByName);


app.get('/administrators', administrators.findAll);
app.get('/administrators/findById/:id', administrators.findOne);
app.post('/administrators/login',administrators.login);
app.post('/administrators/addRecord', administrators.addRecord);
app.post('/administrators/loginByToken',verifyToken,administrators.loginByToken);
app.delete('/administrators/deleteById/:id', administrators.deleteRecord);

app.get('/comment', comments.findAll);
app.get('/:id', comments.findOne);
app.post('/addComment', comments.addComment);
app.delete('/deleteCmt/:id', comments.deleteRecord);

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

var mongodbUri = "mongodb://myron:YWZ378290@ds243518.mlab.com:43518/heroku_mrtb7t53";
console.log(mongodbUri)
mongoose.connect(mongodbUri, {
    useNewUrlParser: true, useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken =bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }

}

module.exports = app;
