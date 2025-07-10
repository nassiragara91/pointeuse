import express from 'express';
import {
  receivePointageData,
  getZKTecoLogs,
  getUnprocessedLogs,
  processLog,
  getDeviceConfig,
  getMyZktecoHistory,
  getMyZktecoHistoryByPeriod
} from '../controllers/zkteco.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour recevoir les données de pointage de la pointeuse (sans authentification)
router.post('/receive', receivePointageData);

// Route pour obtenir la configuration de la pointeuse
router.get('/config', getDeviceConfig);

// Routes protégées (nécessitent une authentification)
router.get('/logs', getZKTecoLogs);
router.get('/logs/unprocessed', getUnprocessedLogs);
router.post('/logs/:id/process', processLog);
router.get('/my-history', protect, getMyZktecoHistory);
router.get('/my-history-period', protect, getMyZktecoHistoryByPeriod);

export default router; 