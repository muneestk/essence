const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  deliveryAddress: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  products: [{
    productid: {
      type: String,
      required: true,
      ref: 'Product'
    },
    count: {
      type: Number,
      default: 1
    },
    productPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },  
  date: {
    type: Date
  },
  status: {
    type: String
  }
});

    module.exports = mongoose.model('Order', orderSchema);
