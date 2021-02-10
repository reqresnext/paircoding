var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const validator = require('express-validator')
var morgan = require('morgan')


require('./passport')

try {
  mongoose.connect(config.dbString, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('db connected')
  });
} catch (error) {
  console.log(error);
}
global.User = require('./models/user')
global.Task = require('./models/task')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactsRouter = require('./routes/contacts');
var loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const taskRouter = require('./routes/task');
var registerRouter = require('./routes/register');

var app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

//instead of app.set('view engine', 'handlebars'); 
app.set('view engine', 'hbs');
//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  //new configuration parameter,
  defaultLayout: 'index',
  extname: 'hbs',
  runtimeOptions: {
    
          allowProtoPropertiesByDefault: true,
    
          allowProtoMethodsByDefault: true,
    
        },
    
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(validator());

app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   secure: true
  // }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
})

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/contacts', contactsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/task', taskRouter);

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
