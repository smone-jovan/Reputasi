require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

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
const demoRoutes = require('./src/routes/demoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/demo', demoRoutes);

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: err.message });
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
