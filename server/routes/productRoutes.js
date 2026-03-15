import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search products - must be before /:id route
router.get('/search', protect, searchProducts);

// Get all products
router.get('/', protect, getAllProducts);

// Get single product
router.get('/:id', protect, getProductById);

// Create product - admin and manager only
router.post('/', protect, authorizeRoles('admin', 'manager'), createProduct);

// Update product - admin and manager only
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateProduct);

// Delete product - admin only
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

export default router;