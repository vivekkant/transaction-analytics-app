var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /transactions listing. */
router.get('/', function(req, res, next) {
  var _condition = {};
  if( req.query.from && req.query.to ) {
    _condition = { tranDate : { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } };
  } else if( req.query.from ) {
    _condition = { tranDate : { $gte: new Date(req.query.from) } };
  } else if ( req.query.to ) {
    _condition = { tranDate : { $lte: new Date(req.query.to) } };
  }

  var _orderby = { sort : { tranDate: 1} };

  var _callback = function (err, transactions) {
    if (err) return next(err);
    res.json(transactions);
  }

  Transaction.find(_condition, null, _orderby, _callback);
});

/* POST /transactions */
router.post('/', function(req, res, next) {
  Transaction.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /transactions/id */
router.get('/:id', function(req, res, next) {
  Transaction.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /transactions/:id */
router.put('/:id', function(req, res, next) {
  Transaction.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /transactions/:id */
router.delete('/:id', function(req, res, next) {
  Transaction.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
