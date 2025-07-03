import { Sequelize } from 'sequelize';
import employeModel from './employe.model.js';
import pointageModel from './pointage.model.js';
import documentModel from './document.model.js';
import rapportModel from './rapport.model.js';

const sequelize = new Sequelize('pointage', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Employe = employeModel(sequelize);
const Pointage = pointageModel(sequelize);
const Document = documentModel(sequelize);
const Rapport = rapportModel(sequelize);

Employe.hasMany(Pointage, { foreignKey: 'employeId' });
Pointage.belongsTo(Employe, { foreignKey: 'employeId' });
Employe.hasMany(Document, { foreignKey: 'employeId' });
Document.belongsTo(Employe, { foreignKey: 'employeId' });

export { sequelize, Employe, Pointage, Document, Rapport };
