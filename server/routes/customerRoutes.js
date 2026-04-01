import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerPurchaseHistory,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateLoyaltyPoints,
  searchCustomers
} from '../controllers/customerController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search customers - must be before /:id
router.get('/search', protect, searchCustomers);

// Get all customers
router.get('/', protect, getAllCustomers);

// Get single customer
router.get('/:id', protect, getCustomerById);

// Create customer
router.post('/', protect, authorizeRoles('admin', 'manager'), createCustomer);

// Update customer
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateCustomer);

// Delete customer - admin only
router.delete('/:id', protect, authorizeRoles('admin'), deleteCustomer);

// Update loyalty points
router.patch('/:id/loyalty', protect, authorizeRoles('admin', 'manager'), updateLoyaltyPoints);

// Get customer purchase history
router.get('/:id/history', protect, authorizeRoles('admin', 'manager'), getCustomerPurchaseHistory);

export default router;