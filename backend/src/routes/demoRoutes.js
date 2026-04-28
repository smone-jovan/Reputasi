const router = require('express').Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { Campaign, Donation, User, Transaction } = require('../models');
const { sequelize } = require('../models');

// POST /api/demo/simulate-payment — admin-only, skip payment gateway
router.post('/simulate-payment', authenticate, isAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { campaign_id, amount, donor_name } = req.body;

    if (!campaign_id || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'campaign_id dan amount wajib diisi.' });
    }

    // Find campaign
    const campaign = await Campaign.findByPk(campaign_id, { transaction: t });
    if (!campaign) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    if (campaign.status !== 'active') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Kampanye tidak aktif.' });
    }

    // Create donation record (status: success, skip payment)
    const donation = await Donation.create({
      user_id: req.user.id,
      campaign_id,
      amount,
      message: `[DEMO TEST] Simulasi donasi dari ${donor_name || 'Admin'}`,
      is_anonymous: false,
      status: 'success',
    }, { transaction: t });

    // Create transaction record (so it shows in admin transactions page)
    const orderId = `DEMO-${Date.now()}-${donation.id}`;
    await Transaction.create({
      donation_id: donation.id,
      order_id: orderId,
      payment_gateway: 'demo',
      payment_method: 'qris',
      gross_amount: amount,
      fee_amount: 0,
      net_amount: amount,
      status: 'settlement',
      paid_at: new Date(),
      gateway_response_raw: JSON.stringify({ type: 'demo_test', donor_name: donor_name || 'Admin' }),
    }, { transaction: t });

    // Update campaign current_amount
    const newAmount = Number(campaign.current_amount) + Number(amount);
    await campaign.update({ current_amount: newAmount }, { transaction: t });

    // Auto-complete if target reached
    if (newAmount >= Number(campaign.target_amount)) {
      await campaign.update({ status: 'completed' }, { transaction: t });
    }

    await t.commit();

    const progress = Math.min(Math.round((newAmount / Number(campaign.target_amount)) * 100), 100);

    res.json({
      success: true,
      message: `Simulasi berhasil! Rp ${Number(amount).toLocaleString('id-ID')} ditambahkan ke "${campaign.title}"`,
      data: {
        donation_id: donation.id,
        order_id: orderId,
        campaign_title: campaign.title,
        previous_amount: Number(campaign.current_amount) - Number(amount),
        new_amount: newAmount,
        target_amount: Number(campaign.target_amount),
        progress,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error('Demo simulate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
