const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Article', articleSchema);
