require('dotenv').config();

module.exports = {
  apiKey: process.env.TRIPAY_API_KEY,
  privateKey: process.env.TRIPAY_PRIVATE_KEY,
  merchantCode: process.env.TRIPAY_MERCHANT_CODE,
  baseUrl: process.env.TRIPAY_BASE_URL || 'https://tripay.co.id/api-sandbox',
};
