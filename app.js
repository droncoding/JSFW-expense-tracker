var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require('polyfill-object.fromentries');

var passport = require('passport');
var session = require('express-session');
var User = require('./models/user');
var githubStrategy = require("passport-github2").Strategy;

var indexRouter = require('./routes/index');
var expensesRouter = require('./routes/expenses');

var app = express();
const config = require('./config/globals');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//authentication
app.use(session({
  secret: 'jsfw', 
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy()); 

passport.use(
  new githubStrategy(
    {
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      }
      else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "GitHub",
          created: Date.now()
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

//routers
app.use('/', indexRouter);
app.use('/expenses', expensesRouter);



//mongodb connection

let connectionString = config.db;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });

//code from class project
const hbs = require('hbs');
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
 
  var selectedProperty = '';
  
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  }
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

// date formatter from class project
hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

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
