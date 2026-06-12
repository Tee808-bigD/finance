const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  ruleName: { type: String, required: true },
  threshold: { type: Number },
  category: { type: String },
  description: { type: String, required: true },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Policy', policySchema);
