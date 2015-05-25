var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /transactions listing. */
router.get('/', function(req, res, next) {
  Transaction.find(function (err, transactions) {
    if (err) return next(err);
    res.json(transactions);
  });
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
