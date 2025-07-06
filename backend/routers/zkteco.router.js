import express from 'express';
import {
  receivePointageData,
  getZKTecoLogs,
  getUnprocessedLogs,
  processLog,
  getDeviceConfig
} from '../controllers/zkteco.controller.js';

const router = express.Router();

// Route pour recevoir les données de pointage de la pointeuse (sans authentification)
router.post('/receive', receivePointageData);

// Route pour obtenir la configuration de la pointeuse
router.get('/config', getDeviceConfig);

// Routes protégées (nécessitent une authentification)
router.get('/logs', getZKTecoLogs);
router.get('/logs/unprocessed', getUnprocessedLogs);
router.post('/logs/:id/process', processLog);

export default router; 