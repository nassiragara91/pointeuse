import { ZKTecoLog, Employe, Pointage } from '../models/index.js';

// Endpoint pour recevoir les données de pointage de la pointeuse ZKTeco
export const receivePointageData = async (req, res) => {
  try {
    const { 
      userId, 
      userName, 
      timestamp, 
      type, 
      fingerId, 
      faceId, 
      deviceId, 
      deviceName, 
      deviceIP,
      rawData 
    } = req.body;

    // Validation des données requises
    if (!userId || !userName || !timestamp || !type || !deviceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Données manquantes: userId, userName, timestamp, type, deviceId sont requis' 
      });
    }

    // Vérifier si c'est un pointage d'entrée ou de sortie
    if (!['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type de pointage invalide. Doit être IN ou OUT' 
      });
    }

    // Créer l'enregistrement dans la table ZKTecoLog
    const zkLog = await ZKTecoLog.create({
      userId,
      userName,
      timestamp: new Date(timestamp),
      type,
      fingerId,
      faceId,
      deviceId,
      deviceName,
      deviceIP,
      rawData: JSON.stringify(rawData || req.body),
      processed: false
    });

    // Essayer de faire correspondre avec un employé existant
    let employe = await Employe.findOne({ 
      where: { nom: userName } 
    });

    if (employe) {
      zkLog.employeId = employe.id;
      await zkLog.save();
    }

    // Traitement automatique du pointage
    await processPointageData(zkLog);

    res.status(200).json({
      success: true,
      message: 'Données de pointage reçues avec succès',
      logId: zkLog.id
    });

  } catch (error) {
    console.error('Erreur lors de la réception des données ZKTeco:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};

// Fonction pour traiter automatiquement les données de pointage
const processPointageData = async (zkLog) => {
  try {
    // Trouver l'employé correspondant
    let employe = await Employe.findOne({ 
      where: { nom: zkLog.userName } 
    });

    if (!employe) {
      console.log(`Employé non trouvé: ${zkLog.userName}`);
      return;
    }

    const today = new Date(zkLog.timestamp);
    today.setHours(0, 0, 0, 0);

    // Vérifier s'il existe déjà un pointage pour aujourd'hui
    let existingPointage = await Pointage.findOne({
      where: {
        employeId: employe.id,
        date: today
      }
    });

    if (zkLog.type === 'IN') {
      // Pointage d'entrée
      if (existingPointage) {
        // Mettre à jour le timeIn si pas déjà défini
        if (!existingPointage.timeIn) {
          existingPointage.timeIn = zkLog.timestamp.toTimeString().split(' ')[0];
          await existingPointage.save();
        }
      } else {
        // Créer un nouveau pointage
        await Pointage.create({
          employeId: employe.id,
          rapport: `Pointage automatique - Entrée à ${zkLog.timestamp.toTimeString().split(' ')[0]}`,
          date: today,
          timeIn: zkLog.timestamp.toTimeString().split(' ')[0],
          typePointage: 'AUTOMATIQUE',
          taskType: 'PRESENCE'
        });
      }
    } else if (zkLog.type === 'OUT') {
      // Pointage de sortie
      if (existingPointage) {
        // Mettre à jour le timeOut
        existingPointage.timeOut = zkLog.timestamp.toTimeString().split(' ')[0];
        
        // Calculer les heures totales si timeIn existe
        if (existingPointage.timeIn) {
          const timeIn = new Date(`2000-01-01 ${existingPointage.timeIn}`);
          const timeOut = new Date(`2000-01-01 ${existingPointage.timeOut}`);
          const diffMs = timeOut - timeIn;
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          existingPointage.totalHours = `${diffHours}h${diffMinutes}m`;
        }
        
        await existingPointage.save();
      } else {
        // Créer un nouveau pointage avec seulement timeOut
        await Pointage.create({
          employeId: employe.id,
          rapport: `Pointage automatique - Sortie à ${zkLog.timestamp.toTimeString().split(' ')[0]}`,
          date: today,
          timeOut: zkLog.timestamp.toTimeString().split(' ')[0],
          typePointage: 'AUTOMATIQUE',
          taskType: 'PRESENCE'
        });
      }
    }

    // Marquer comme traité
    zkLog.processed = true;
    await zkLog.save();

  } catch (error) {
    console.error('Erreur lors du traitement automatique:', error);
  }
};

// Récupérer tous les logs ZKTeco
export const getZKTecoLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, processed } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (processed !== undefined) {
      where.processed = processed === 'true';
    }

    const logs = await ZKTecoLog.findAndCountAll({
      where,
      include: [{ model: Employe, attributes: ['id', 'nom', 'email'] }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      logs: logs.rows,
      total: logs.count,
      page: parseInt(page),
      totalPages: Math.ceil(logs.count / limit)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des logs ZKTeco:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer les logs non traités
export const getUnprocessedLogs = async (req, res) => {
  try {
    const logs = await ZKTecoLog.findAll({
      where: { processed: false },
      include: [{ model: Employe, attributes: ['id', 'nom', 'email'] }],
      order: [['timestamp', 'DESC']]
    });

    res.json(logs);

  } catch (error) {
    console.error('Erreur lors de la récupération des logs non traités:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Traiter manuellement un log
export const processLog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const log = await ZKTecoLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: 'Log non trouvé' });
    }

    await processPointageData(log);

    res.json({ 
      success: true, 
      message: 'Log traité avec succès',
      log 
    });

  } catch (error) {
    console.error('Erreur lors du traitement manuel:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Configuration de la pointeuse
export const getDeviceConfig = async (req, res) => {
  try {
    // Retourner la configuration pour la pointeuse
    const config = {
      serverUrl: `${req.protocol}://${req.get('host')}/api/zkteco/receive`,
      pushInterval: 30, // secondes
      enabled: true,
      deviceInfo: {
        name: 'SpeedFace V4L',
        type: 'Face Recognition',
        version: '1.0'
      }
    };

    res.json(config);

  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}; 