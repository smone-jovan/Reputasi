const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Campaign = require('./Campaign');
const CampaignImage = require('./CampaignImage');
const Donation = require('./Donation');
const Transaction = require('./Transaction');
const Withdrawal = require('./Withdrawal');
const Notification = require('./Notification');
const Squad = require('./Squad');
const SquadMember = require('./SquadMember');
const Setting = require('./Setting');

// ── Add squad_id to Donation (optional FK) ──
Donation.belongsTo(Squad, { foreignKey: { name: 'squad_id', allowNull: true }, as: 'squad' });
Squad.hasMany(Donation, { foreignKey: 'squad_id', as: 'donations' });

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

// ── Squad Associations ──

// Campaign <-> Squad
Campaign.hasMany(Squad, { foreignKey: 'campaign_id', as: 'squads' });
Squad.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// User (creator) <-> Squad
User.hasMany(Squad, { foreignKey: 'creator_id', as: 'created_squads' });
Squad.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// Squad <-> SquadMember
Squad.hasMany(SquadMember, { foreignKey: 'squad_id', as: 'members' });
SquadMember.belongsTo(Squad, { foreignKey: 'squad_id', as: 'squad' });

// User <-> SquadMember
User.hasMany(SquadMember, { foreignKey: 'user_id', as: 'squad_memberships' });
SquadMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

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
  Squad,
  SquadMember,
  Setting,
};

