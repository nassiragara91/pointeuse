import { Pointage, Employe } from '../models/index.js';

export const getPointages = async (req, res) => {
  const data = await Pointage.findAll({
    include: Employe,
    order: [['date', 'DESC']],
  });
  res.json(data);
};

export const createPointage = async (req, res) => {
  const { nom, rapport, date, timeIn, timeOut, totalHours, project } = req.body;

  if (!nom || !rapport) return res.status(400).json({ message: 'Nom et rapport obligatoires' });

  let employe = await Employe.findOne({ where: { nom } });
  if (!employe) employe = await Employe.create({ nom });

  const pointage = await Pointage.create({
    rapport,
    date,
    timeIn,
    timeOut,
    totalHours,
    project,
    employeId: employe.id,
  });

  res.status(201).json(pointage);
};