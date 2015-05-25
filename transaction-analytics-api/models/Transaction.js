var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  tranDate: Date,
  payee: String,
  accountName: String,
  category: String,
  subCategory: String,
  withdrawl: Number,
  deposit: Number,
  total: Number,
  comment: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
