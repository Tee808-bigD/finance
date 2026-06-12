const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  submitter: { type: String, required: true },
  amount: { type: Number, required: true },
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Flagged', 'Rejected'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
