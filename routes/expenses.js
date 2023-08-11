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

module.exports = router;