var express = require('express');
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET
//REGISTER
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new Account" });
});

//GET
//LOGIN
router.get("/login", (req, res, next) => {
  // retrieve the messages
  let messages = req.session.messages || [];
  // clear messages from session
  req.session.messages = [];
  // send messages to view
  res.render("login", { title: "Login to your Account", messages: messages });
});

//POST
//REGISTER
router.post("/register", (req, res, next) => {
  User.register(
    {
      username: req.body.username,
    },
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(newUser, (err) => {
          res.redirect("/expenses");
        });
      }
    }
  );
});

//POST
//LOGIN
router.post(
  "/login",
  passport.authenticate(
    "local", 
    {
      successRedirect: "/expenses",
      failureRedirect: "/login",
      failureMessage: "Invalid Credentials", 
    }
  )
);

//GET
//LOG OUT
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

module.exports = router;
