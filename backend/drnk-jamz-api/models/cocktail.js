const mongoose = require('mongoose');

const cocktailSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  directions: { type: String, required: true },
  cId: { type: String },
  genre: { type: String },
});

cocktailSchema.index({ name: 'text', directions: 'text', categories: 'text' });

const Cocktail = mongoose.model('Cocktail', cocktailSchema);

module.exports = Cocktail;
