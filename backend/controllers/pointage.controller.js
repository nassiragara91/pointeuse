import { Pointage, Employe } from '../models/index.js';

export const getPointages = async (req, res) => {
  const data = await Pointage.findAll({
    include: Employe,
    order: [['date', 'DESC']],
  });
  res.json(data);
};

export const createPointage = async (req, res) => {
  const { nom, rapport, date, timeIn, timeOut, totalHours, project, typePointage, taskType, documentCode } = req.body;

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
    typePointage,
    taskType,
    documentCode,
    employeId: employe.id,
  });

  res.status(201).json(pointage);
};

export const updatePointage = async (req, res) => {
  const { id } = req.params;
  const { rapport } = req.body;
  try {
    const pointage = await Pointage.findByPk(id);
    if (!pointage) return res.status(404).json({ message: 'Pointage non trouvé' });
    if (rapport !== undefined) pointage.rapport = rapport;
    await pointage.save();
    res.json(pointage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
};