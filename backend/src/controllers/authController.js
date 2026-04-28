const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password, // Will be hashed by the model hook
      phone,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal registrasi.', error: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login berhasil.',
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal login.', error: error.message });
  }
};

// GET /api/auth/me
exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar_url } = req.body;

    await req.user.update({ name, phone, avatar_url });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: { user: req.user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.', error: error.message });
  }
};
