import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentBySale,
  getPaymentSummary
} from '../controllers/paymentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a payment record
router.post('/', protect, createPayment);

// Get all payments - admin and manager only
router.get('/', protect, authorizeRoles('admin', 'manager'), getAllPayments);

// Get payment summary by method - admin and manager only
router.get('/summary', protect, authorizeRoles('admin', 'manager'), getPaymentSummary);

// Get payment by sale ID
router.get('/sale/:saleId', protect, getPaymentBySale);

export default router;