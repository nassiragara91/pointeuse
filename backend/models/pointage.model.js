import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Pointage = sequelize.define('Pointage', {
    rapport: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { timestamps: false });

  return Pointage;
}; 