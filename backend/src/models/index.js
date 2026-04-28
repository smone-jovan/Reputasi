const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Campaign = require('./Campaign');
const CampaignImage = require('./CampaignImage');
const Donation = require('./Donation');
const Transaction = require('./Transaction');
const Withdrawal = require('./Withdrawal');
const Notification = require('./Notification');

// ── Associations ──

// User <-> Campaign (admin creates campaigns)
User.hasMany(Campaign, { foreignKey: 'user_id', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

// Category <-> Campaign
Category.hasMany(Campaign, { foreignKey: 'category_id', as: 'campaigns' });
Campaign.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Campaign <-> CampaignImage
Campaign.hasMany(CampaignImage, { foreignKey: 'campaign_id', as: 'images' });
CampaignImage.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// User <-> Donation
User.hasMany(Donation, { foreignKey: 'user_id', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'user_id', as: 'donatur' });

// Campaign <-> Donation
Campaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Donation <-> Transaction (one-to-one)
Donation.hasOne(Transaction, { foreignKey: 'donation_id', as: 'transaction' });
Transaction.belongsTo(Donation, { foreignKey: 'donation_id', as: 'donation' });

// Campaign <-> Withdrawal
Campaign.hasMany(Withdrawal, { foreignKey: 'campaign_id', as: 'withdrawals' });
Withdrawal.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// User (admin) <-> Withdrawal
User.hasMany(Withdrawal, { foreignKey: 'admin_id', as: 'withdrawals' });
Withdrawal.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Campaign,
  CampaignImage,
  Donation,
  Transaction,
  Withdrawal,
  Notification,
};
