import jwt from 'jsonwebtoken';
import { Employe } from '../models/index.js';

const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - headers:', req.headers.authorization ? 'Authorization header present' : 'No Authorization header');
  console.log('Auth middleware - cookies:', req.cookies ? Object.keys(req.cookies) : 'No cookies');

  // Check for token in Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Using token from Authorization header');
  }
  // Fall back to cookie if no Authorization header
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Using token from cookie');
  }

  if (token) {
    try {
      console.log('Verifying token...');
      // Verify token
      const decoded = jwt.verify(token, 'your_jwt_secret');
      console.log('Token verified, user ID:', decoded.id);

      // Get user from the token
      req.user = await Employe.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User authenticated:', req.user.nom);
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token found');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect }; 