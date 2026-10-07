const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Middleware to verify Admin JWT
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    jwt.verify(token, ADMIN_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
      }
      if (!decoded || !decoded.isAdmin) {
        return res.status(403).json({ error: 'Admin privileges required.' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews - Get all reviews (Public)
// Supports optional filtering by productId via query parameters
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    const filter = {};
    if (productId) {
      filter.productId = productId;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/:id - Get review by ID (Public)
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    return res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews - Create a new review (Public)
router.post('/', async (req, res, next) => {
  try {
    const { productId, userName, rating, comment, verifiedBuyer } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }
    if (!userName || userName.trim() === '') {
      return res.status(400).json({ error: 'userName is required.' });
    }
    if (rating === undefined || rating === null || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be a number between 1 and 5.' });
    }

    const newReview = new Review({
      productId,
      userName,
      rating: Number(rating),
      comment: comment || '',
      verifiedBuyer: verifiedBuyer === true || verifiedBuyer === 'true',
      createdAt: new Date()
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// PUT /api/reviews/:id - Update an existing review (Require Admin)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { productId, userName, rating, comment, verifiedBuyer } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    if (productId !== undefined) review.productId = productId;
    if (userName !== undefined) review.userName = userName;
    if (rating !== undefined) {
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating must be a number between 1 and 5.' });
      }
      review.rating = Number(rating);
    }
    if (comment !== undefined) review.comment = comment;
    if (verifiedBuyer !== undefined) {
      review.verifiedBuyer = verifiedBuyer === true || verifiedBuyer === 'true';
    }

    const updatedReview = await review.save();
    return res.status(200).json(updatedReview);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// DELETE /api/reviews/:id - Delete a review (Require Admin)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    return res.status(200).json({ message: 'Review successfully deleted.', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;