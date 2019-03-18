const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  _itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  }
});

cartSchema.methods.addInCart = function(){
  return this.save();
}



var Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart};