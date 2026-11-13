const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'se_project_jwt_secret_token_key_2026';
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    },
    secret,
    { expiresIn: '7d' }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

// Get current profile
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await UserModel.findByIdAndUpdate(req.user.id, updates, { new: true });
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
