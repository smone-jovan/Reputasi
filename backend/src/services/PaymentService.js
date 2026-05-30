const { Donation, Transaction, Campaign, Notification, Squad, User, Setting } = require('../models');
const tripayService = require('./tripayService');

class PaymentService {
  /**
   * Initialize a new payment for a donation
   */
  async createPayment({ campaign_id, amount, message, is_anonymous, payment_method, bank_code, squad_id, user, host, protocol }) {
    // Check for payment bypass mode
    const isBypassActive = await Setting.getValue('payment_bypass_mode', false);

    // 1. Validate Campaign
    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign || campaign.status !== 'active') {
      throw new Error('Kampanye tidak tersedia.');
    }

    if (amount < 10000) {
      throw new Error('Minimal donasi Rp 10.000.');
    }

    // 2. Create Donation Record
    const donationStatus = isBypassActive ? 'success' : 'pending';
    const donation = await Donation.create({
      user_id: user.id,
      campaign_id,
      amount,
      message,
      is_anonymous: is_anonymous || false,
      squad_id: squad_id || null,
      status: donationStatus,
    });

    const orderId = `DNR-${Date.now()}-${donation.id}`;

    if (isBypassActive) {
      // 3a. Handle Bypassed Payment
      const transaction = await Transaction.create({
        donation_id: donation.id,
        order_id: orderId,
        payment_gateway: 'bypass',
        payment_method: payment_method || 'qris',
        gross_amount: amount,
        fee_amount: 0,
        net_amount: amount,
        status: 'settlement',
        paid_at: new Date(),
        gateway_response_raw: JSON.stringify({ mode: 'test_bypass' }),
      });

      // Attach donation to transaction for _handleSuccessfulPayment
      transaction.donation = donation;
      await this._handleSuccessfulPayment(transaction);

      return {
        donation,
        transaction,
        gatewayData: {
          bypass: true,
          amount: amount,
          checkout_url: '#',
          instructions: [{ title: 'Mode Testing Aktif', steps: ['Pembayaran otomatis berhasil disimulasi.'] }]
        }
      };
    }

    // 3b. Standard Gateway Request
    const tripayMethod = this._mapToTripayMethod(payment_method, bank_code);
    const callbackUrl = `${protocol}://${host}/api/transactions/callback`;
    const returnUrl = process.env.FRONTEND_URL || 'http://localhost:5500';

    const tripayResponse = await tripayService.createTransaction({
      method: tripayMethod,
      merchantRef: orderId,
      amount,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      orderItems: [{
        name: `Donasi: ${campaign.title}`,
        price: amount,
        quantity: 1,
      }],
      callbackUrl,
      returnUrl: `${returnUrl}/payment-status.html?order_id=${orderId}`,
    });

    if (!tripayResponse.success) {
      await donation.update({ status: 'failed' });
      throw new Error(`Gagal membuat pembayaran: ${tripayResponse.message}`);
    }

    const tripayData = tripayResponse.data;

    // 4. Create Transaction Record
    const transaction = await Transaction.create({
      donation_id: donation.id,
      order_id: orderId,
      payment_gateway: 'tripay',
      payment_method: payment_method || 'qris',
      bank_code: bank_code || null,
      qris_url: tripayData.qr_url || null,
      va_number: tripayData.pay_code || null,
      gross_amount: amount,
      fee_amount: tripayData.total_fee || 0,
      net_amount: amount - (tripayData.total_fee || 0),
      status: 'pending',
      gateway_reference_id: tripayData.reference,
      gateway_response_raw: JSON.stringify(tripayData),
      expired_at: new Date(tripayData.expired_time * 1000),
    });

    return { donation, transaction, gatewayData: tripayData };
  }

  /**
   * Process payment callback/webhook
   */
  async handleCallback(callbackData, signatureHeader) {
    // 1. Verify Signature (Logic remains in tripayService but we call it here)
    // Actually tripayService.verifyCallbackSignature is better suited

    // For now, let's keep the verification in controller or move it here
    // If we move it here, we need the raw body if Tripay requires it.

    const { merchant_ref, status } = callbackData;

    // 2. Find and Lock Transaction
    const transaction = await Transaction.findOne({
      where: { order_id: merchant_ref },
      include: [{ model: Donation, as: 'donation' }],
    });

    if (!transaction) {
      throw new Error('Transaction not found.');
    }

    const newStatus = this._mapFromTripayStatus(status);

    // 3. Prevent Replay
    if (transaction.status === 'settlement' && newStatus === 'settlement') {
      return { alreadyProcessed: true };
    }

    // 4. Update Records
    await transaction.update({
      status: newStatus,
      paid_at: newStatus === 'settlement' ? new Date() : null,
      gateway_response_raw: JSON.stringify(callbackData),
    });

    const donationStatus = newStatus === 'settlement' ? 'success' :
                          (newStatus === 'expire' || newStatus === 'deny' ? 'failed' : 'pending');

    await transaction.donation.update({ status: donationStatus });

    // 5. Handle Side Effects on Success
    if (newStatus === 'settlement') {
      await this._handleSuccessfulPayment(transaction);
    }

    return { success: true, status: newStatus };
  }

  async _handleSuccessfulPayment(transaction) {
    const { donation } = transaction;

    // Increment Campaign
    const campaign = await Campaign.findByPk(donation.campaign_id);
    if (campaign) {
      await campaign.increment('current_amount', { by: donation.amount });
      await campaign.reload();
      if (campaign.current_amount >= campaign.target_amount) {
        await campaign.update({ status: 'completed' });
      }
    }

    // Increment Squad if applicable
    if (donation.squad_id) {
      const squad = await Squad.findByPk(donation.squad_id);
      if (squad) {
        await squad.incrementAmount(donation.amount);
      }
    }

    // Send Notification
    await Notification.create({
      user_id: donation.user_id,
      title: 'Donasi Berhasil! 🎉',
      message: `Terima kasih! Donasi sebesar Rp ${donation.amount.toLocaleString('id-ID')} telah diterima.`,
      type: 'donation',
    });
  }

  _mapToTripayMethod(method, bankCode) {
    if (method === 'bank_transfer' && bankCode) {
      const bankMap = {
        bca: 'BCAVA',
        bni: 'BNIVA',
        bri: 'BRIVA',
        mandiri: 'MANDIRIVA',
        bsi: 'BSIVA',
        permata: 'PERMATAVA',
        cimb: 'CIMBVA',
      };
      return bankMap[bankCode.toLowerCase()] || 'BCAVA';
    }
    return 'QRIS';
  }

  _mapFromTripayStatus(tripayStatus) {
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

module.exports = new PaymentService();
