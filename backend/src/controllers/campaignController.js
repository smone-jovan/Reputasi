const { Op } = require('sequelize');
const { Campaign, Category, User, Donation, CampaignImage } = require('../models');

// POST /api/campaigns
exports.create = async (req, res) => {
  try {
    const { title, short_description, description, target_amount, category_id, banner_image, deadline } = req.body;

    const campaign = await Campaign.create({
      user_id: req.user.id,
      category_id,
      title,
      short_description,
      description,
      target_amount,
      banner_image,
      deadline,
    });

    res.status(201).json({
      success: true,
      message: 'Kampanye berhasil dibuat.',
      data: { campaign },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat kampanye.', error: error.message });
  }
};

// GET /api/campaigns
exports.getAll = async (req, res) => {
  try {
    const { status, category_id, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'icon'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kampanye.', error: error.message });
  }
};

// GET /api/campaigns/:id
exports.getById = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        { model: CampaignImage, as: 'images' },
        {
          model: Donation,
          as: 'donations',
          where: { status: 'success' },
          required: false,
          limit: 10,
          order: [['created_at', 'DESC']],
          include: [{ model: User, as: 'donatur', attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    // Count total donors
    const donorCount = await Donation.count({
      where: { campaign_id: campaign.id, status: 'success' },
    });

    res.json({
      success: true,
      data: { campaign, donorCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kampanye.', error: error.message });
  }
};

// PUT /api/campaigns/:id
exports.update = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    const { title, short_description, description, target_amount, category_id, banner_image, status, deadline } = req.body;

    await campaign.update({
      title, short_description, description, target_amount,
      category_id, banner_image, status, deadline,
    });

    res.json({
      success: true,
      message: 'Kampanye berhasil diperbarui.',
      data: { campaign },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kampanye.', error: error.message });
  }
};

// DELETE /api/campaigns/:id (soft delete via status)
exports.delete = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    await campaign.update({ status: 'cancelled' });

    res.json({ success: true, message: 'Kampanye berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kampanye.', error: error.message });
  }
};

// GET /api/campaigns/:id/donors
exports.getDonors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: donations } = await Donation.findAndCountAll({
      where: { campaign_id: req.params.id, status: 'success' },
      include: [{ model: User, as: 'donatur', attributes: ['id', 'name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data donatur.', error: error.message });
  }
};

// POST /api/campaigns/submit — user submits campaign for review
exports.submit = async (req, res) => {
  try {
    const { title, short_description, description, target_amount, category_id, banner_image, deadline } = req.body;

    if (!title || !category_id || !target_amount) {
      return res.status(400).json({ success: false, message: 'Judul, kategori, dan target dana wajib diisi.' });
    }

    if (target_amount < 100000) {
      return res.status(400).json({ success: false, message: 'Minimal target dana Rp 100.000.' });
    }

    const campaign = await Campaign.create({
      user_id: req.user.id,
      category_id,
      title,
      short_description,
      description,
      target_amount,
      banner_image,
      deadline,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Kampanye berhasil diajukan. Menunggu persetujuan admin.',
      data: { campaign },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengajukan kampanye.', error: error.message });
  }
};

// PUT /api/campaigns/:id/approve — admin approves campaign
exports.approve = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    if (campaign.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Hanya kampanye dengan status pending yang bisa disetujui.' });
    }

    await campaign.update({ status: 'active' });

    res.json({ success: true, message: 'Kampanye berhasil disetujui.', data: { campaign } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyetujui kampanye.', error: error.message });
  }
};

// PUT /api/campaigns/:id/reject — admin rejects campaign
exports.reject = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Kampanye tidak ditemukan.' });
    }

    if (campaign.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Hanya kampanye dengan status pending yang bisa ditolak.' });
    }

    const { reason } = req.body;
    await campaign.update({ status: 'rejected' });

    res.json({ success: true, message: 'Kampanye berhasil ditolak.', data: { campaign, reason } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menolak kampanye.', error: error.message });
  }
};

// GET /api/campaigns/my — user gets their own campaigns
exports.getMy = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'icon'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kampanye.', error: error.message });
  }
};
