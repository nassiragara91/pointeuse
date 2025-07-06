import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ZKTecoLog = sequelize.define('ZKTecoLog', {
    // Données de base du pointage
    userId: { type: DataTypes.STRING, allowNull: false }, // ID utilisateur sur la pointeuse
    userName: { type: DataTypes.STRING, allowNull: false }, // Nom de l'utilisateur
    timestamp: { type: DataTypes.DATE, allowNull: false }, // Horodatage du pointage
    type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false }, // Type de pointage (entrée/sortie)
    
    // Données biométriques (si disponibles)
    fingerId: { type: DataTypes.INTEGER, allowNull: true }, // ID du doigt utilisé
    faceId: { type: DataTypes.INTEGER, allowNull: true }, // ID du visage (pour SpeedFace)
    
    // Données de la pointeuse
    deviceId: { type: DataTypes.STRING, allowNull: false }, // ID de la pointeuse
    deviceName: { type: DataTypes.STRING, allowNull: true }, // Nom de la pointeuse
    deviceIP: { type: DataTypes.STRING, allowNull: true }, // IP de la pointeuse
    
    // Statut de traitement
    processed: { type: DataTypes.BOOLEAN, defaultValue: false }, // Si traité par l'application
    employeId: { type: DataTypes.INTEGER, allowNull: true }, // ID de l'employé dans notre système
    
    // Données brutes reçues
    rawData: { type: DataTypes.TEXT, allowNull: true }, // Données brutes reçues de la pointeuse
  }, { 
    timestamps: true,
    indexes: [
      { fields: ['userId', 'timestamp'] },
      { fields: ['processed'] },
      { fields: ['deviceId'] }
    ]
  });

  return ZKTecoLog;
}; 