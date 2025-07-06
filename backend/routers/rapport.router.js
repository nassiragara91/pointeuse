import { Router } from 'express';
import { getRapports, getRapportById, createRapport, deleteRapport } from '../controllers/rapport.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(protect, getRapports)
  .post(protect, createRapport);

router.route('/:id')
  .get(protect, getRapportById)
  .delete(protect, deleteRapport);

export default router; 