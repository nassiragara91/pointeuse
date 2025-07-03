import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
  updateDocument,
  downloadDocument
} from '../controllers/document.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const upload = multer();
const router = Router();

router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocumentById);
router.get('/documents/:id/download', downloadDocument);
router.post('/documents', protect, upload.single('file'), createDocument);
router.delete('/documents/:id', deleteDocument);
router.put('/documents/:id', updateDocument);

export default router; 