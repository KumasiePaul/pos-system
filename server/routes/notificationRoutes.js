import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get notifications for current user's role
router.get('/', protect, authorizeRoles('admin', 'manager'), getNotifications);

// Mark all as read
router.patch('/read-all', protect, authorizeRoles('admin', 'manager'), markAllAsRead);

// Mark single notification as read
router.patch('/:id/read', protect, authorizeRoles('admin', 'manager'), markAsRead);

export default router;
