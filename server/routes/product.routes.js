const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline middleware to check admin authorization
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded && (decoded.isAdmin || decoded.role === 'admin')) {
      req.adminUser = decoded;
      return next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// GET /api/products - Get all products (Public)
router.get('/', async (req, res, next) => {
  try {
    const { category, subCategory, skillLevel, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }
    if (subCategory) {
      filter.subCategory = { $regex: new RegExp(subCategory, 'i') };
    }
    if (skillLevel) {
      filter.skillLevel = { $regex: new RegExp(skillLevel, 'i') };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { material: { $regex: new RegExp(search, 'i') } },
        { flexRating: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:idOrSlug - Get single product by MongoDB ID or slug (Public)
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product = null;

    // Try finding by MongoDB ObjectId format first
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    }

    // If not found by ID or not an ID, try finding by slug
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product (Public for submission/easy setup)
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      slug,
      category,
      subCategory,
      price,
      compareAtPrice,
      images,
      flexRating,
      weight,
      length,
      material,
      skillLevel
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required fields.' });
    }

    // Generate unique slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check for unique slug conflict
    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ error: `A product with slug or name "${finalSlug}" already exists.` });
    }

    const newProduct = new Product({
      name,
      slug: finalSlug,
      category,
      subCategory,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      images,
      flexRating,
      weight,
      length,
      material,
      skillLevel
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;