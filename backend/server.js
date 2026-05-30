require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./src/models');
const seedData = require('./src/seed');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const withdrawalRoutes = require('./src/routes/withdrawalRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const squadRoutes = require('./src/routes/squadRoutes');
const demoRoutes = require('./src/routes/demoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // To allow loading images from /uploads
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak request, silakan coba lagi nanti.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Limit each IP to 10 login/register requests per 15 minutes
  message: { success: false, message: 'Terlalu banyak percobaan login/register, silakan coba lagi nanti.' }
});

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? true  // Allow all origins in development
    : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000'),
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all API requests
app.use('/api/', apiLimiter);

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/admin', adminRoutes);

// Dashboard stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const { Campaign, Donation, User } = require('./src/models');

    const totalCampaigns = await Campaign.count({ where: { status: 'active' } });
    const totalDonations = await Donation.sum('amount', { where: { status: 'success' } }) || 0;
    const totalDonors = await User.count({ where: { role: 'donatur' } });
    const totalTransactions = await Donation.count({ where: { status: 'success' } });

    res.json({
      success: true,
      data: {
        totalCampaigns,
        totalDonations,
        totalDonors,
        totalTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Donaria API is running 🚀', timestamp: new Date().toISOString() });
});

// Public test mode status
app.get('/api/settings/test-mode', async (req, res) => {
  try {
    const { Setting } = require('./src/models');
    const enabled = await Setting.getValue('test_mode', false);
    res.json({ success: true, data: { enabled } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Don't expose internal stack trace/details in production
  const errorMsg = process.env.NODE_ENV === 'production' 
    ? 'Terjadi kesalahan internal server.' 
    : err.message;
    
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: errorMsg });
});

// Start server
const startServer = async () => {
  try {
    // Sync database (create tables if not exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    // Seed data
    await seedData();

    app.listen(PORT, () => {
      console.log(`\n🚀 Donaria API Server running on http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📊 Stats: http://localhost:${PORT}/api/stats\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;

// Trigger nodemon restart
