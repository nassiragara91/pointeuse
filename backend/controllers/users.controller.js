import { Employe } from '../models/index.js';
import bcrypt from 'bcrypt';

// Liste tous les employés
export const getAllUsers = async (req, res) => {
  try {
    const users = await Employe.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des employés', error });
  }
};

// Modifie le rôle d'un employé
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: 'Le rôle est requis' });
  try {
    const user = await Employe.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Employé non trouvé' });
    user.role = role;
    await user.save();
    res.json({ message: 'Rôle mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle', error });
  }
};

export const createUser = async (req, res) => {
  const { matricule, nom, prenom, email, role, manager_id, departement, password } = req.body;
  if (!matricule || !nom || !prenom || !role || !password) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }
  try {
    // Vérifier unicité matricule et email
    const existMatricule = await Employe.findOne({ where: { matricule } });
    if (existMatricule) return res.status(409).json({ message: 'Matricule déjà utilisé' });
    if (email) {
      const existEmail = await Employe.findOne({ where: { email } });
      if (existEmail) return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const employe = await Employe.create({
      matricule,
      nom,
      prenom,
      email,
      role,
      manager_id,
      departement,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'Employé créé', employe });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'employé', error });
  }
}; 