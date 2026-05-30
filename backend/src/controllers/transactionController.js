const crypto = require('crypto');
const { Transaction, Donation, Campaign, Notification } = require('../models');
const tripayConfig = require('../config/tripay');

// POST /api/transactions/callback (Tripay webhook)
exports.callback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Verify callback signature
    const signature = crypto
      .createHmac('sha256', tripayConfig.privateKey)
      .update(JSON.stringify(callbackData))
      .digest('hex');

    // Check the callback signature header
    const callbackSignature = req.headers['x-callback-signature'];
    if (!callbackSignature || callbackSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature.' });
    }

    const { merchant_ref, status, reference } = callbackData;

    // Find the transaction
    const transaction = await Transaction.findOne({
      where: { order_id: merchant_ref },
      include: [{ model: Donation, as: 'donation' }],
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    // Map Tripay status
    const statusMap = {
      UNPAID: 'pending',
      PAID: 'settlement',
      EXPIRED: 'expire',
      FAILED: 'deny',
      REFUND: 'cancel',
    };

    const newStatus = statusMap[status] || 'pending';

    // Prevent Replay Attack (Do not process if already settled)
    if (transaction.status === 'settlement' && newStatus === 'settlement') {
      return res.json({ success: true, message: 'Transaction already settled. Ignored.' });
    }

    // Update transaction
    await transaction.update({
      status: newStatus,
      paid_at: newStatus === 'settlement' ? new Date() : null,
      gateway_response_raw: JSON.stringify(callbackData),
    });

    // Update donation status
    const donationStatus = newStatus === 'settlement' ? 'success' : newStatus === 'expire' || newStatus === 'deny' ? 'failed' : 'pending';
    await transaction.donation.update({ status: donationStatus });

    // If payment successful, update campaign amount and send notification
    if (newStatus === 'settlement') {
      const campaign = await Campaign.findByPk(transaction.donation.campaign_id);
      if (campaign) {
        await campaign.increment('current_amount', { by: transaction.donation.amount });

        // Check if campaign target reached
        const updatedCampaign = await campaign.reload();
        if (updatedCampaign.current_amount >= updatedCampaign.target_amount) {
          await campaign.update({ status: 'completed' });
        }
      }

      // Send notification to donor
      await Notification.create({
        user_id: transaction.donation.user_id,
        title: 'Donasi Berhasil! 🎉',
        message: `Terima kasih! Donasi sebesar Rp ${transaction.donation.amount.toLocaleString('id-ID')} telah diterima.`,
        type: 'donation',
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ success: false, message: 'Callback processing failed.' });
  }
};

// GET /api/transactions/:id
exports.getById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{
        model: Donation,
        as: 'donation',
        include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'title'] }],
      }],
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    res.json({ success: true, data: { transaction } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi.', error: error.message });
  }
};

// GET /api/transactions (admin only)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, source } = req.query;
    const offset = (page - 1) * limit;
    const { Op } = require('sequelize');

    const where = {};
    if (status) where.status = status;

    // Filter by source: demo, test, or real
    if (source === 'demo') {
      where.order_id = { [Op.like]: 'DEMO-%' };
    } else if (source === 'test') {
      where.order_id = { [Op.like]: 'TEST-%' };
    } else if (source === 'real') {
      where.order_id = { [Op.and]: [{ [Op.notLike]: 'DEMO-%' }, { [Op.notLike]: 'TEST-%' }] };
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [{
        model: Donation,
        as: 'donation',
        include: [
          { model: Campaign, as: 'campaign', attributes: ['id', 'title'] },
          { model: require('../models/User'), as: 'donatur', attributes: ['id', 'name', 'email'] },
        ],
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi.', error: error.message });
  }
};

// GET /api/transactions/check/:orderId (check payment status)
exports.checkStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { order_id: req.params.orderId },
      include: [{
        model: Donation,
        as: 'donation',
        include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'title'] }],
      }],
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    res.json({
      success: true,
      data: {
        order_id: transaction.order_id,
        status: transaction.status,
        payment_method: transaction.payment_method,
        amount: transaction.gross_amount,
        paid_at: transaction.paid_at,
        expired_at: transaction.expired_at,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengecek status.', error: error.message });
  }
};
