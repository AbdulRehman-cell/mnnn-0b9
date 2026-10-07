const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required to group cart items'],
      trim: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of a product within a specific user session
cartItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;