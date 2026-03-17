import express from 'express';
import {
  getReceipt,
  getAllReceipts
} from '../controllers/receiptController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all receipts - admin and manager only
router.get('/', protect, authorizeRoles('admin', 'manager'), getAllReceipts);

// Get single receipt by sale ID
router.get('/:saleId', protect, getReceipt);

export default router;