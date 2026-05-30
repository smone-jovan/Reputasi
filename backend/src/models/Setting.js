const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('boolean', 'string', 'number', 'json'),
    defaultValue: 'string',
  },
}, {
  tableName: 'settings',
  timestamps: true,
});

// Helper to get typed value
Setting.getValue = async function(key, defaultValue = null) {
  const setting = await this.findByPk(key);
  if (!setting) return defaultValue;

  switch (setting.type) {
    case 'boolean': return setting.value === 'true';
    case 'number': return Number(setting.value);
    case 'json': return JSON.parse(setting.value);
    default: return setting.value;
  }
};

Setting.setValue = async function(key, value, type = 'string') {
  let stringValue = String(value);
  if (type === 'json') stringValue = JSON.stringify(value);

  const [setting] = await this.upsert({ key, value: stringValue, type });
  return setting;
};

module.exports = Setting;
