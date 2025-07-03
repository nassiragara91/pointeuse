import { Pointage, Rapport, Employe, Document } from '../models/index.js';

export const getRecentActivities = async (req, res) => {
  const employeId = req.user.id;
  const nom_employe = req.user.nom;
  // 1. Récupérer les 5 derniers pointages
  const pointages = await Pointage.findAll({
    where: { employeId },
    order: [['date', 'DESC']],
    limit: 5,
    include: Employe,
  });
  // 2. Récupérer les 5 derniers rapports
  const rapports = await Rapport.findAll({
    where: { nom_employe },
    order: [['date_rapport', 'DESC']],
    limit: 5,
  });
  // 3. Récupérer les 5 derniers documents GED
  const documents = await Document.findAll({
    where: { employeId },
    order: [['dateAjout', 'DESC']],
    limit: 5,
  });
  // 4. Fusionner et trier par date décroissante
  const activities = [
    ...pointages.map(p => ({
      type: 'Pointage',
      date: p.date,
      projet: p.project,
      heures: p.timeIn && p.timeOut ? `${p.timeIn}-${p.timeOut}` : p.totalHours,
      rapport: p.rapport,
      typeTache: p.taskType,
    })),
    ...rapports.map(r => ({
      type: 'Rapport',
      date: r.date_rapport,
      projet: r.projet,
      rapport: r.contenu,
      typeTache: r.type_tache,
    })),
    ...documents.map(d => ({
      type: 'GED',
      date: d.dateAjout,
      projet: d.projet,
      document: d.nom,
      version: d.version,
      action: 'Ajouté',
    })),
  ];
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(activities.slice(0, 5));
}; 