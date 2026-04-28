const axios = require('axios');
const crypto = require('crypto');
const tripayConfig = require('../config/tripay');

class TripayService {
  constructor() {
    this.client = axios.create({
      baseURL: tripayConfig.baseUrl,
      headers: {
        Authorization: `Bearer ${tripayConfig.apiKey}`,
      },
    });
  }

  // Get available payment channels
  async getPaymentChannels() {
    const response = await this.client.get('/merchant/payment-channel');
    return response.data;
  }

  // Generate signature for transaction
  generateSignature(merchantRef, amount) {
    return crypto
      .createHmac('sha256', tripayConfig.privateKey)
      .update(tripayConfig.merchantCode + merchantRef + amount)
      .digest('hex');
  }

  // Create closed transaction (QRIS or Bank Transfer)
  async createTransaction({ method, merchantRef, amount, customerName, customerEmail, customerPhone, orderItems, callbackUrl, returnUrl }) {
    const signature = this.generateSignature(merchantRef, amount);

    const payload = {
      method,
      merchant_ref: merchantRef,
      amount,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      order_items: orderItems,
      callback_url: callbackUrl,
      return_url: returnUrl,
      expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      signature,
    };

    const response = await this.client.post('/transaction/create', payload);
    return response.data;
  }

  // Get transaction detail
  async getTransactionDetail(reference) {
    const response = await this.client.get(`/transaction/detail?reference=${reference}`);
    return response.data;
  }

  // Verify callback signature from Tripay webhook
  verifyCallbackSignature(callbackData) {
    const { merchant_ref, amount } = callbackData;
    const expectedSignature = this.generateSignature(merchant_ref, amount);

    // Tripay sends signature in the callback JSON
    return callbackData.signature === expectedSignature;
  }

  // Map Tripay payment method code to our payment_method field
  static mapPaymentMethod(tripayMethod) {
    const qrisMethods = ['QRIS', 'QRISC', 'QRIS2'];
    if (qrisMethods.includes(tripayMethod)) return 'qris';
    return 'bank_transfer';
  }

  // Map Tripay status to our status field
  static mapStatus(tripayStatus) {
    const statusMap = {
      UNPAID: 'pending',
      PAID: 'settlement',
      EXPIRED: 'expire',
      FAILED: 'deny',
      REFUND: 'cancel',
    };
    return statusMap[tripayStatus] || 'pending';
  }
}

module.exports = new TripayService();
