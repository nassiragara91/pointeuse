import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Pointage = sequelize.define('Pointage', {
    rapport: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    timeIn: { type: DataTypes.TIME, allowNull: true },
    timeOut: { type: DataTypes.TIME, allowNull: true },
    totalHours: { type: DataTypes.STRING, allowNull: true },
    project: { type: DataTypes.STRING, allowNull: true },
  }, { timestamps: false });

  return Pointage;
};