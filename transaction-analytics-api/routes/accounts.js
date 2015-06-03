var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /accounts listing. */
router.get('/', function(req, res, next) {

  var _query = { $group: { _id: '$accountName',
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

  var _callback = function(err, accounts) {
      if (err) return next(err);
      // Reformat the response to substitute _id with account
      var _accounts = [];
      for (var i = 0; i < accounts.length; i++) {
        var _account = {};
        _account.accountName = accounts[i]._id;
        _account.withdrawl = accounts[i].withdrawl;
        _account.deposit = accounts[i].deposit;
        _account.total = _account.deposit - _account.withdrawl;
        _accounts[i] = _account;
      }
      res.json(_accounts);
  };

  Transaction.aggregate( _aggregate, _callback );
});

/* GET /accounts/:account */
router.get('/:account', function(req, res, next) {

  var _condition = { accountName: req.params.account };
  if( req.query.from && req.query.to ) {
    _condition = { accountName: req.params.account,
                   tranDate : { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } 
                 };
  } else if( req.query.from ) {
    _condition = { accountName: req.params.account, 
                   tranDate : { $gte: new Date(req.query.from) } 
                 };
  } else if ( req.query.to ) {
    _condition = { accountName: req.params.account, 
                   tranDate : { $lte: new Date(req.query.to) } 
                 };
  }

  var _orderby = { sort : { tranDate: 1} };

  var _callback = function (err, transactions) {
    if (err) return next(err);
    res.json(transactions);
  }

  console.log(_condition);

  Transaction.find(_condition, null, _orderby, _callback);
});

module.exports = router;
