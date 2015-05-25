var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /categories listing. */
router.get('/', function(req, res, next) {
  Transaction.aggregate([{ $group: { _id: '$category',
                                     withdrawl: {$sum: '$withdrawl'}, 
                                     deposit: {$sum: '$deposit'}
                                   } 
                        }],
    function(err, categories) {
      if (err) return next(err);
      res.json(categories);
    });
});

/* GET /categories/:category */
router.get('/:category', function(req, res, next) {
    Transaction.aggregate([{ $match: { category: req.params.category} },
                           { $group: { _id: '$subCategory',
                                     withdrawl: {$sum: '$withdrawl'}, 
                                     deposit: {$sum: '$deposit'}
                                     } 
                          }],
    function(err, category) {
      if (err) return next(err);
      res.json(category);
    });
});

/* GET /categories/:category/:subCategory */
router.get('/:category/:subCategory', function(req, res, next) {
    Transaction.find({ category: req.params.category, subCategory: req.params.subCategory }, 
      function(err, transactions) {
        if (err) return next(err);
        res.json(transactions);
    });
});


module.exports = router;
