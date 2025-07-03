import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Rapport = sequelize.define('Rapport', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom_employe: { type: DataTypes.STRING, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    projet: { type: DataTypes.STRING, allowNull: true },
    type_tache: { type: DataTypes.STRING, allowNull: true },
    date_rapport: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    type_pointage: { type: DataTypes.STRING, allowNull: true },
    // Ajoute d'autres champs si besoin
  }, { timestamps: false });

  return Rapport;
}; 