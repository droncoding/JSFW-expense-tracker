const express = require("express");
const router = express.Router();
const Account = require("../models/accounts");
// Reusable function to check whether user is authenticated
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect("/login"); 
}

// GET 
router.get("/", (req, res, next) => {
    Account.find((err, courses) => {
    if (err) {
      console.log(err);
    } else {
      res.render("accounts/index", {
        title: "Accounts",
        dataset: accounts,
        user: req.user,
      });
    }
  });
});

// GET 
//ADD
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("accounts/add", {
    title: "Add a new account",
    user: req.user,
  });
});

// POST 
//Add
router.post("/add", IsLoggedIn, (req, res, next) => {
 
  Account.create(
    {
      name: req.body.name,
    },
    (err, newAccount) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/accounts");
      }
    }
  );
});

module.exports = router;