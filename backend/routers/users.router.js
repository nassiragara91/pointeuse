import { Router } from 'express';
import { updateUserRole, getAllUsers, createUser } from '../controllers/users.controller.js';
import { protect, isAdminOrRH } from '../middleware/authMiddleware.js';

const router = Router();

// Liste tous les employés
router.get('/', protect, isAdminOrRH, getAllUsers);

// Crée un nouvel employé
router.post('/', protect, isAdminOrRH, createUser);

// Modifie le rôle d'un employé
router.patch('/:id/role', protect, isAdminOrRH, updateUserRole);

export default router; 