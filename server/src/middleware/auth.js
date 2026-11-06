import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'crm_pro_super_secret_jwt_key_2026_enterprise_saas';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Generate JWT token helper
export const generateToken = (userId, role = 'admin') => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Protect routes middleware
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please provide a valid Bearer token.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Try finding user in database or fallback to mock user object
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch {
      // If DB is offline, populate decoded info
    }

    if (!user) {
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: 'Viraj Somani',
        email: 'viraj@crmpro.io',
        role: decoded.role || 'admin',
        title: 'Developer / Admin'
      };
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token signature invalid or expired. Please re-authenticate.'
    });
  }
};

// Grant access to specific roles (Role-Based Access Control)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User authentication required.'
      });
    }

    const userRole = (req.user.role || 'rep').toLowerCase();
    const normalizedRoles = roles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to execute this action. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

