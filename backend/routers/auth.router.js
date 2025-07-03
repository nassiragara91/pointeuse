import { Router } from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

export default router; 