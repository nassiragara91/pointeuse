import express from 'express';
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

const router = express.Router();

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocumentById);
router.get('/documents/:id/download', downloadDocument);
router.post('/documents', upload.single('file'), createDocument);
router.delete('/documents/:id', deleteDocument);
router.put('/documents/:id', updateDocument);

export default router; 