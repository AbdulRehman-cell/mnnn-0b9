const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    subCategory: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare-at price must be a positive number'],
      default: null
    },
    images: {
      type: [String],
      required: [true, 'Product images are required']
    },
    flexRating: {
      type: String,
      trim: true,
      default: 'N/A'
    },
    weight: {
      type: String,
      trim: true,
      default: 'N/A'
    },
    length: {
      type: String,
      trim: true,
      default: 'N/A'
    },
    material: {
      type: String,
      trim: true,
      default: 'Carbon Composite'
    },
    skillLevel: {
      type: String,
      trim: true,
      default: 'All Levels',
      index: true
    },
    stockCount: {
      type: Number,
      min: [0, 'Stock count cannot be negative'],
      default: 0
    },
    badge: {
      type: String,
      trim: true,
      default: 'None'
    },
    sku: {
      type: String,
      trim: true,
      default: null,
      unique: true,
      sparse: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common search/filter patterns
productSchema.index({ name: 'text', material: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;