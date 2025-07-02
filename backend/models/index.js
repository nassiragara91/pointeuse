import { Sequelize } from 'sequelize';
import employeModel from './employe.model.js';
import pointageModel from './pointage.model.js';
import documentModel from './document.model.js';

const sequelize = new Sequelize('pointage', 'postgres', 'pp25531189', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Employe = employeModel(sequelize);
const Pointage = pointageModel(sequelize);
const Document = documentModel(sequelize);

Employe.hasMany(Pointage, { foreignKey: 'employeId' });
Pointage.belongsTo(Employe, { foreignKey: 'employeId' });

export { sequelize, Employe, Pointage, Document };
