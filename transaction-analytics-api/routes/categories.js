var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /categories listing. */
router.get('/', function(req, res, next) {

  var _query = { $group: { _id: '$category',
                                     withdrawl: {$sum: '$withdrawl'}, 
                                     deposit: {$sum: '$deposit'}
                          } 
                };

  var _condition = null;
  if( req.query.from && req.query.to ) {
    _condition = { $match: { tranDate : { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } } };
  } else if( req.query.from ) {
    _condition = { $match: { tranDate : { $gte: new Date(req.query.from) } } };
  } else if ( req.query.to ) {
    _condition = { $match: { tranDate : { $lte: new Date(req.query.to) } } };
  }

  var _aggregate = (_condition) ? [_condition, _query] : [_query]; 

  var _callback = function(err, categories) {
      if (err) return next(err);
      // Reformat the response to substitute _id with category
      var _categories = [];
      for (var i = 0; i < categories.length; i++) {
        var _category = {};
        _category.category = categories[i]._id;
        _category.withdrawl = categories[i].withdrawl;
        _category.deposit = categories[i].deposit;
        _category.total = _category.deposit - _category.withdrawl;
        _categories[i] = _category;
      }
      res.json(_categories);
  };

  Transaction.aggregate( _aggregate, _callback );
});

/* GET /categories/:category */
router.get('/:category', function(req, res, next) {
    var _query = { $group: { _id: '$subCategory',
                                     withdrawl: {$sum: '$withdrawl'}, 
                                     deposit: {$sum: '$deposit'}
                                     } 
                  };

    var _filter = { $match: { category: req.params.category} };

    var _condition = null;
    if( req.query.from && req.query.to ) {
      _condition = { $match: { tranDate : { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } } };
    } else if( req.query.from ) {
      _condition = { $match: { tranDate : { $gte: new Date(req.query.from) } } };
    } else if ( req.query.to ) {
      _condition = { $match: { tranDate : { $lte: new Date(req.query.to) } } };
    }

    var _aggregate = (_condition) ? [_condition, _filter, _query] : [_filter, _query]; 

    var _callback = function(err, category) {
      if (err) return next(err);
      // Reformat the response remove default _id and add category & subcategory
      var _category = [];
      for (var i = 0; i < category.length; i++) {
        var _subCategory = {};
        _subCategory.category = req.params.category;
        _subCategory.subCategory = category[i]._id;
        _subCategory.withdrawl = category[i].withdrawl;
        _subCategory.deposit = category[i].deposit;
        _subCategory.total = _subCategory.deposit - _subCategory.withdrawl;
        _category[i] = _subCategory;
      }
      res.json(_category);
    };

    Transaction.aggregate(_aggregate, _callback);
});

/* GET /categories/:category/:subCategory */
router.get('/:category/:subCategory', function(req, res, next) {

  var _condition = { category: req.params.category, subCategory: req.params.subCategory };
  if ( req.query.from && req.query.to ) {
    _condition = { category: req.params.category, 
                   subCategory: req.params.subCategory, 
                   tranDate : { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } 
                 };
  } else if( req.query.from ) {
    _condition = { category: req.params.category, 
                   subCategory: req.params.subCategory, 
                   tranDate : { $gte: new Date(req.query.from) } 
                 };
  } else if ( req.query.to ) {
    _condition = { category: req.params.category, 
                   subCategory: req.params.subCategory, 
                   tranDate : { $lte: new Date(req.query.to) } 
                 };
  }

  var _orderby = { sort : { tranDate: 1} };

  var _callback = function (err, transactions) {
    if (err) return next(err);
    res.json(transactions);
  }

  Transaction.find(_condition, null, _orderby, _callback);
});


module.exports = router;
