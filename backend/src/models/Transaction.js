const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  donation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  order_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  payment_gateway: {
    type: DataTypes.STRING(50),
    defaultValue: 'tripay',
  },
  payment_method: {
    type: DataTypes.ENUM('qris', 'bank_transfer'),
    allowNull: false,
  },
  bank_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  qris_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  va_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  gross_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  fee_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  net_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'settlement', 'expire', 'cancel', 'deny'),
    defaultValue: 'pending',
  },
  gateway_reference_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  gateway_response_raw: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'transactions',
});

module.exports = Transaction;
