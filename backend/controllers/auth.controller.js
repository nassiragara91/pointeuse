import jwt from 'jsonwebtoken';
import { Employe } from '../models/index.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const employe = await Employe.findOne({ where: { email } });

  if (!employe || !(await employe.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: employe.id, nom: employe.nom }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  res.json({ token });
};

export const register = async (req, res) => {
  const { nom, email, password } = req.body;
  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Nom, email, et mot de passe requis.' });
  }
  const existing = await Employe.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
  }
  try {
    const employe = await Employe.create({ nom, email, password });
    const token = jwt.sign({ id: employe.id, nom: employe.nom }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
}; 