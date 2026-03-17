import express from 'express';
import {
  getDailySales,
  getWeeklySales,
  getProductPerformance,
  getCashierPerformance,
  getSummary
} from '../controllers/reportController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All report routes - admin and manager only
router.get('/summary', protect, authorizeRoles('admin', 'manager'), getSummary);
router.get('/daily', protect, authorizeRoles('admin', 'manager'), getDailySales);
router.get('/weekly', protect, authorizeRoles('admin', 'manager'), getWeeklySales);
router.get('/products', protect, authorizeRoles('admin', 'manager'), getProductPerformance);
router.get('/cashiers', protect, authorizeRoles('admin', 'manager'), getCashierPerformance);

export default router;