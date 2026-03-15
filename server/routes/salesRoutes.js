import express from 'express';
import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesByCashier
} from '../controllers/salesController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new sale - all logged in users
router.post('/', protect, createSale);

// Get all sales - admin and manager only
router.get('/', protect, authorizeRoles('admin', 'manager'), getAllSales);

// Get sales by cashier - cashier sees only their own sales
router.get('/my-sales', protect, getSalesByCashier);

// Get single sale
router.get('/:id', protect, getSaleById);

export default router;