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
      // Reformat the response to substitute _id with category
      var _categories = [];
      for (var i = 0; i < categories.length; i++) {
        var _category = {};
        _category.category = categories[i]._id;
        _category.withdrawl = categories[i].withdrawl;
        _category.deposit = categories[i].deposit;
        _categories[i] = _category;
      }
      res.json(_categories);
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
      // Reformat the response remove default _id and add category & subcategory
      var _category = [];
      for (var i = 0; i < category.length; i++) {
        var _subCategory = {};
        _subCategory.category = req.params.category;
        _subCategory.subCategory = category[i]._id;
        _subCategory.withdrawl = category[i].withdrawl;
        _subCategory.deposit = category[i].deposit;
        _category[i] = _subCategory;
      }
      res.json(_category);
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
