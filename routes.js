const express = require('express');
const router = express.Router();
const Product = require('./product');

// --- Custom Error Classes ---
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

// --- Middleware ---

// Logger middleware
function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}

// JSON body parser middleware
router.use(express.json());

// Authentication middleware
function authenticate(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (apiKey !== 'my-secret-api-key') {
    return next(new ValidationError('Invalid or missing API key'));
  }
  next();
}

// Validation middleware for product creation and update
function validateProduct(req, res, next) {
  const { name, price } = req.body;
  if (typeof name !== 'string' || name.trim() === '') {
    return next(new ValidationError('Name is required and must be a string'));
  }
  if (typeof price !== 'number' || isNaN(price)) {
    return next(new ValidationError('Price is required and must be a number'));
  }
  next();
}

// Apply logger and authentication middleware to all routes
router.use(logger);
router.use(authenticate);

// --- Helper for async error handling ---
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// --- Advanced Features ---

// GET /api/products/search?name=... - Search products by name
router.get('/api/products/search', asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  if (!name) {
    return next(new ValidationError('Search term "name" is required'));
  }
  // Case-insensitive search using regex
  const results = await Product.find({ name: { $regex: name, $options: 'i' } });
  res.json({ total: results.length, products: results });
}));

// GET /api/products/stats - Get product statistics (count by category)
router.get('/api/products/stats', asyncHandler(async (req, res, next) => {
  // Use MongoDB aggregation to count products by category
  const stats = await Product.aggregate([
    {
      $group: {
        _id: { $ifNull: ['$category', 'Uncategorized'] },
        count: { $sum: 1 }
      }
    }
  ]);
  // Format the result as { countByCategory: { category: count, ... } }
  const countByCategory = {};
  stats.forEach(stat => {
    countByCategory[stat._id] = stat.count;
  });
  res.json({ countByCategory });
}));

// --- Global Error Handler ---
router.use((err, req, res, next) => {
  if (err instanceof NotFoundError || err instanceof ValidationError) {
    return res.status(err.status).json({ error: err.name, message: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong' });
});

module.exports = router;