const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Squad = sequelize.define('Squad', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  target_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  current_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  invite_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'expired'),
    defaultValue: 'active',
  },
}, {
  tableName: 'squads',
});

module.exports = Squad;
