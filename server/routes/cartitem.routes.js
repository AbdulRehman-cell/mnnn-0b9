const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CartItem = require('../models/CartItem');

// ADMIN_JWT_SECRET definition
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline requireAdmin Middleware
function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.role === 'admin') {
      req.admin = decoded;
      return next();
    }

    return res.status(403).json({ error: 'Access denied: Requires admin role' });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * GET /api/cartitems
 * Public: Get cart items. Usually filtered by sessionId query parameter.
 */
router.get('/', async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const filter = {};
    if (sessionId) {
      filter.sessionId = sessionId;
    }
    const items = await CartItem.find(filter);
    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/cartitems/:id
 * Public: Retrieve a single cart item by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    return res.status(200).json(item);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/cartitems
 * Public: Create a new cart item (e.g. adding item to cart, or updating quantity if duplicate exists).
 */
router.post('/', async (req, res, next) => {
  try {
    const { productId, name, image, price, quantity, sessionId } = req.body;

    if (!productId || !name || price === undefined || quantity === undefined || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields: productId, name, price, quantity, and sessionId are required' });
    }

    // Check if the item already exists in this session's cart
    let existingItem = await CartItem.findOne({ productId, sessionId });
    
    if (existingItem) {
      existingItem.quantity += Number(quantity);
      if (existingItem.quantity <= 0) {
        await CartItem.findByIdAndDelete(existingItem._id);
        return res.status(200).json({ message: 'Item removed from cart because quantity is 0 or less' });
      }
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    // Otherwise create a new cart item
    const newItem = new CartItem({
      productId,
      name,
      image,
      price,
      quantity,
      sessionId
    });

    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

/**
 * PUT /api/cartitems/:id
 * Restricted to Admin: Update an existing cart item by ID.
 * (For public front-end cart adjustments, consumers typical use the POST endpoint to upsert/merge
 * or we can expose a dedicated public route if needed, but per prompt guidelines PUT requires requireAdmin)
 */
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { productId, name, image, price, quantity, sessionId } = req.body;
    
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { productId, name, image, price, quantity, sessionId },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

/**
 * DELETE /api/cartitems/:id
 * Restricted to Admin: Delete a cart item by ID.
 * (To allow public session-clearing actions without breaking standard auth rules,
 * the frontend can leverage the POST endpoint with quantity <= 0 or sessionId merges. 
 * Per prompt guidelines, physical DELETE endpoint is secured via requireAdmin).
 */
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    return res.status(200).json({ message: 'Cart item successfully deleted', deletedItem });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;