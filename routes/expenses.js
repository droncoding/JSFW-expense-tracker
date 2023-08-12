// Import express and create a router
const express = require('express');
const router = express.Router();


const Expense = require('../models/expenses');
const Account = require("../models/accounts");


function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // continue processing request
    }
    res.redirect("/login"); // not authenticated
  }


router.get('/', (req, res, next) => {

    Expense.find((err, expenses) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('expenses/index', { 
                title: 'Expense Tracker', 
                dataset: expenses,
                user: req.user
             });
        }
    })

});

router.get('/add', IsLoggedIn, (req, res, next) => {

    Account.find((err, accounts) => {
        if (err) {
          console.log(err);
        } else {
          res.render("expenses/add", {
            title: "Add a New Expense",
            accountList: accounts,
            user: req.user
          });
        }
      });
});


// Add POST handler
router.post('/add', IsLoggedIn, (req, res, next) => {
    Expense.create({
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category
    }, (err, newExpense) => {
        if (err) {
            console.log(err);
        }
        else {
            // We can show a successful message by redirecting them to index
            res.redirect('/expenses');
        }
    });
});


//GET
//DELETE
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
    Expense.remove(
      {
        _id: req.params._id,
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/expenses");
        }
      }
    );
  });


  //GET
  //EDIT
  router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {
    Expense.findById(req.params._id, (err, expense) => {
      if (err) {
        console.log(err);
      } else {
        Account.find((err, accounts) => {
          if (err) {
            console.log(err);
          } else {
            res.render("expenses/edit", {
              title: "Edit a Expense",
              expense: expense,
              accounts: accounts,
            });
          }
        }).sort({ name: 1 });
      }
    });
  });


  //POST
  //EDIT
  router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
    
    Expense.findOneAndUpdate(
      { _id: req.params._id },
      {
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category,
        account: req.body.account,
      },
      (err, updatedExpense) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/expenses");
        }
      }
    );
  });
module.exports = router;