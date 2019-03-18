const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
  },
  _itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  person: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  paymentway: {
    type: String,
    required: true,
  }
});



var Order = mongoose.model('Order', orderSchema);

module.exports = {Order};