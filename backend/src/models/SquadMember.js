const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SquadMember = sequelize.define('SquadMember', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  squad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('creator', 'member'),
    defaultValue: 'member',
  },
}, {
  tableName: 'squad_members',
  updatedAt: false,
  createdAt: 'joined_at',
  indexes: [
    {
      unique: true,
      fields: ['squad_id', 'user_id'],
    },
  ],
});

module.exports = SquadMember;
