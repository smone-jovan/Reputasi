const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CampaignImage = sequelize.define('CampaignImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'campaign_images',
  updatedAt: false,
});

module.exports = CampaignImage;
