import { Sequelize } from 'sequelize';
import employeModel from './employe.model.js';
import pointageModel from './pointage.model.js';

const sequelize = new Sequelize('pointage', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Employe = employeModel(sequelize);
const Pointage = pointageModel(sequelize);

Employe.hasMany(Pointage, { foreignKey: 'employeId' });
Pointage.belongsTo(Employe, { foreignKey: 'employeId' });

export { sequelize, Employe, Pointage };
