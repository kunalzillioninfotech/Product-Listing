const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  availableDate: Date, 
});
module.exports = mongoose.model('Product',productSchema);