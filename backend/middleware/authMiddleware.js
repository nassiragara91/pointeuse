import jwt from 'jsonwebtoken';
import { Employe } from '../models/index.js';

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    try {
      // Get token from cookie
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Get user from the token
      req.user = await Employe.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect }; 