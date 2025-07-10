import { Router } from 'express';
import { getPointages, createPointage, updatePointage, getMyZktecoPointages } from '../controllers/pointage.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(protect, getPointages)
  .post(protect, createPointage);

router.route('/:id')
  .put(protect, updatePointage);

router.get('/zkteco/my-history', protect, getMyZktecoPointages);

export default router; 