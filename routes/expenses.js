// Import express and create a router
const express = require('express');
const router = express.Router();


const Expense = require('../models/expenses');
const Account = require("../models/accounts");

router.get('/', (req, res, next) => {

    Expense.find((err, expenses) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('expenses/index', { title: 'Expense Tracker', dataset: expenses });
        }
    })

    //res.render('expenses/index', { title: 'Expense Tracker' });
});

router.get('/add', (req, res, next) => {

    Account.find((err, accounts) => {
        if (err) {
          console.log(err);
        } else {
          res.render("expenses/add", {
            title: "Add a New Expense",
            accountList: accounts,
          });
        }
      });
});


// Add POST handler
router.post('/add', (req, res, next) => {
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
router.get("/delete/:_id", (req, res, next) => {
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
  router.get("/edit/:_id", (req, res, next) => {
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

module.exports = router;