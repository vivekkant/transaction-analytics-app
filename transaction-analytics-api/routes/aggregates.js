var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET /aggregates by year, month, category, subcategory. */
router.get('/', function(req, res, next) {

  var _query = { $group: 
  					{ _id: { year : { $year : "$tranDate" }, 
  							 month : { $month: "$tranDate" },
  							 category : "$category",
  							 subCategory : "$subCategory" 
  						   }, 
  						withdrawl: {$sum: '$withdrawl'}, 
  						deposit: {$sum: '$deposit'} 
  					} 
  				};

  var _filter = [];
  _filter.push(_query);
  if ( req.query.year ) {
  	_filter.push( { $match: { "_id.year" :  parseInt(req.query.year) } } );
  	if ( req.query.month ) {
  		_filter.push( { $match: { "_id.month" :  parseInt(req.query.month) } } );
  	}
  }
  if ( req.query.category ) {
  	_filter.push( { $match: { "_id.category" :  req.query.category } } );
  	  if ( req.query.subCategory ) {
  		_filter.push( { $match: { "_id.subCategory" :  req.query.subCategory } } );
  	}
  }

  var _orderby = { $sort : { "_id.year": 1, "_id.month": 1, "_id.category": 1, "_id.subCategory": 1} };
  _filter.push(_orderby);

  var _callback = function(err, aggregates) {
  	if (err) return next(err);
  	  // Reformat the response remove default _id and add category & subcategory
	  var _aggregates = [];
	  for (var i = 0; i < aggregates.length; i++) {
	    var _aggregate = {};
	    _aggregate.category = aggregates[i]._id.category;
	    _aggregate.subCategory = aggregates[i]._id.subCategory;
	    _aggregate.year = aggregates[i]._id.year;
	    _aggregate.month = aggregates[i]._id.month;
	    _aggregate.withdrawl = aggregates[i].withdrawl;
	    _aggregate.deposit = aggregates[i].deposit;
	    _aggregate.total = _aggregate.deposit - _aggregate.withdrawl;

	    _aggregates[i] = _aggregate;
	  }
      res.json(_aggregates);
  };

  Transaction.aggregate( _filter, _callback );
});

module.exports = router;
