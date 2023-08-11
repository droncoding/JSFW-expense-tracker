var express = require('express');
var router = express.Router();

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

module.exports = router;
