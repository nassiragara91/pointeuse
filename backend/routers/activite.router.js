import { Router } from 'express';
import { getRecentActivities } from '../controllers/activite.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', protect, getRecentActivities);
export default router; 