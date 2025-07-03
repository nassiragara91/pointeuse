import { Router } from 'express';
import { getPointages, createPointage, updatePointage } from '../controllers/pointage.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(protect, getPointages)
  .post(protect, createPointage);

router.route('/:id')
  .put(protect, updatePointage);

export default router; 