const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemName: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number,
  },
  introduction: {
    required: true,
    type: [String],
  },
  description: {
    required: true,
    type: [String],
  },
  specification: {
    required: true,
    type: [String],
  },
  img : {
    required: true,
    type: String,
  },
});


let Product = mongoose.model('products', productSchema);

module.exports = {Product};