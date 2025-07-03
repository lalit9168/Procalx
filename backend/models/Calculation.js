const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
  a: Number,
  b: Number,
  operation: String,
  result: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calculation', CalculationSchema);