const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['physical', 'digital', 'service'] // Example constraint
  },
  billiningin: {
    type: Boolean,
    default: false
  },
  srno: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
