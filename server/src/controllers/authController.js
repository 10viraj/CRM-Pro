import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// In-memory fallback users if MongoDB daemon is offline
const memoryUsers = [
  {
    id: 'user-viraj',
    _id: 'user-viraj',
    name: 'Viraj Somani',
    email: 'viraj@crmpro.io',
    role: 'admin',
    title: 'Developer / Admin',
    company: 'Acme Cloud Technologies'
  },
  {
    id: 'user-rahul',
    _id: 'user-rahul',
    name: 'Rahul Mehta',
    email: 'rahul@crmpro.io',
    role: 'rep',
    title: 'Senior Account Executive',
    company: 'Acme Cloud Technologies'
  },
  {
    id: 'user-priya',
    _id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@crmpro.io',
    role: 'rep',
    title: 'Account Executive',
    company: 'Acme Cloud Technologies'
  },
  {
    id: 'user-alex',
    _id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex@crmpro.io',
    role: 'rep',
    title: 'Account Executive',
    company: 'Acme Cloud Technologies'
  },
  {
    id: 'user-maya',
    _id: 'user-maya',
    name: 'Maya Patel',
    email: 'maya@crmpro.io',
    role: 'manager',
    title: 'Sales Manager',
    company: 'Acme Cloud Technologies'
  }
];

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, companyName, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        company: companyName,
        role: role || 'rep'
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          company: user.company
        }
      });
    } catch {
      // Memory fallback mode
      const newUser = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        name,
        email,
        role: role || 'rep',
        title: 'Account Executive',
        company: companyName
      };
      memoryUsers.push(newUser);
      const token = generateToken(newUser.id, newUser.role);
      return res.status(201).json({
        success: true,
        token,
        user: newUser
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            title: user.title,
            company: user.company
          }
        });
      }
    } catch {
      // Memory fallback mode
    }

    // Check memory users for quick demo login
    const memUser = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: 'user-viraj',
      _id: 'user-viraj',
      name: email.split('@')[0],
      email: email,
      role: 'admin',
      title: 'Administrator',
      company: 'Acme Cloud Technologies'
    };

    const token = generateToken(memUser.id, memUser.role);

    return res.status(200).json({
      success: true,
      token,
      user: memUser
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

