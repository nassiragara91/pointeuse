import { Router } from 'express';
import { getPointages, createPointage } from '../controllers/pointage.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(protect, getPointages)
  .post(protect, createPointage);

export default router; 