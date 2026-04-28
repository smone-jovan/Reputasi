const { Withdrawal, Campaign, User } = require('../models');

// POST /api/withdrawals
exports.create = async (req, res) => {
  try {
    const { campaign_id, amount, bank_name, account_number, account_holder, notes } = req.body;

    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    if (amount > campaign.current_amount) {
      return res.status(400).json({ success: false, message: 'Jumlah pencairan melebihi dana yang tersedia.' });
    }

    const withdrawal = await Withdrawal.create({
      campaign_id,
      admin_id: req.user.id,
      amount,
      bank_name,
      account_number,
      account_holder,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Permintaan pencairan berhasil dibuat.',
      data: { withdrawal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat pencairan.', error: error.message });
  }
};

// GET /api/withdrawals
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count, rows: withdrawals } = await Withdrawal.findAndCountAll({
      where,
      include: [
        { model: Campaign, as: 'campaign', attributes: ['id', 'title'] },
        { model: User, as: 'admin', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: { withdrawals, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pencairan.', error: error.message });
  }
};

// PUT /api/withdrawals/:id (approve/reject)
exports.updateStatus = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByPk(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Pencairan tidak ditemukan.' });
    }

    const { status, notes } = req.body;
    if (!['approved', 'rejected', 'transferred'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    await withdrawal.update({ status, notes });

    res.json({
      success: true,
      message: `Pencairan berhasil di-${status}.`,
      data: { withdrawal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pencairan.', error: error.message });
  }
};
