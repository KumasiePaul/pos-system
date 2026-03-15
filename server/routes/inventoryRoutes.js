import express from 'express';
import {
  getAllInventory,
  getLowStockItems,
  createInventory,
  updateStock,
  adjustStock
} from '../controllers/inventoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all inventory
router.get('/', protect, getAllInventory);

// Get low stock items
router.get('/low-stock', protect, getLowStockItems);

// Create inventory record
router.post('/', protect, authorizeRoles('admin', 'manager'), createInventory);

// Update stock
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateStock);

// Adjust stock
router.patch('/:id/adjust', protect, authorizeRoles('admin', 'manager'), adjustStock);

export default router;