import { Rapport } from '../models/index.js';

export const getRapports = async (req, res) => {
  const rapports = await Rapport.findAll({ order: [['date_rapport', 'DESC']] });
  res.json(rapports);
};

export const getRapportById = async (req, res) => {
  const rapport = await Rapport.findByPk(req.params.id);
  if (!rapport) return res.status(404).json({ message: 'Rapport non trouvé' });
  res.json(rapport);
};

export const createRapport = async (req, res) => {
  const { nom_employe, contenu, projet, type_tache, date_rapport, type_pointage } = req.body;
  if (!nom_employe || !contenu) return res.status(400).json({ message: 'Champs requis manquants' });
  const rapport = await Rapport.create({ nom_employe, contenu, projet, type_tache, date_rapport, type_pointage });
  res.status(201).json(rapport);
};

export const deleteRapport = async (req, res) => {
  const nb = await Rapport.destroy({ where: { id: req.params.id } });
  if (!nb) return res.status(404).json({ message: 'Rapport non trouvé' });
  res.json({ message: 'Rapport supprimé' });
}; 