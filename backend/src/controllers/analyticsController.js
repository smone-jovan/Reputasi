const { Op, fn, col, literal } = require('sequelize');
const { Donation, Campaign, User, Transaction, Category } = require('../models');

// GET /api/admin/analytics/trend — donation totals per day (last 7 days)
exports.trend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const donations = await Donation.findAll({
      where: {
        status: 'success',
        created_at: { [Op.gte]: startDate },
      },
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('SUM', col('amount')), 'total'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true,
    });

    // Fill missing days with 0
    const result = [];
    const current = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      const found = donations.find(d => d.date === dateStr);
      result.push({
        date: dateStr,
        total: found ? parseInt(found.total) : 0,
        count: found ? parseInt(found.count) : 0,
      });
      current.setDate(current.getDate() + 1);
    }

    res.json({ success: true, data: { trend: result } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data trend.', error: error.message });
  }
};

// GET /api/admin/analytics/top-campaigns — top 5 campaigns by progress
exports.topCampaigns = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const campaigns = await Campaign.findAll({
      attributes: ['id', 'title', 'target_amount', 'current_amount', 'status'],
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
      ],
      order: [[literal('current_amount / target_amount'), 'DESC']],
      limit,
    });

    const result = campaigns.map(c => ({
      id: c.id,
      title: c.title,
      category: c.category?.name || '-',
      target_amount: parseInt(c.target_amount),
      current_amount: parseInt(c.current_amount),
      progress: Math.min(Math.round((parseInt(c.current_amount) / parseInt(c.target_amount)) * 100), 100),
      status: c.status,
    }));

    res.json({ success: true, data: { campaigns: result } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kampanye.', error: error.message });
  }
};

// GET /api/admin/analytics/top-donors — top 5 donors by total amount
exports.topDonors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const donors = await Donation.findAll({
      where: { status: 'success' },
      attributes: [
        'user_id',
        [fn('SUM', col('amount')), 'total_amount'],
        [fn('COUNT', col('id')), 'donation_count'],
      ],
      include: [
        { model: User, as: 'donatur', attributes: ['name', 'email'] },
      ],
      group: ['user_id', 'donatur.id', 'donatur.name', 'donatur.email'],
      order: [[literal('SUM(amount)'), 'DESC']],
      limit,
      raw: true,
      nest: true,
    });

    const result = donors.map(d => ({
      user_id: d.user_id,
      name: d.donatur?.name || 'Anonim',
      email: d.donatur?.email || '-',
      total_amount: parseInt(d.total_amount),
      donation_count: parseInt(d.donation_count),
    }));

    res.json({ success: true, data: { donors: result } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data donatur.', error: error.message });
  }
};
