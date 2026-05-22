const { Squad, SquadMember, Campaign, User, Donation, Notification } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Generate unique invite code (6 chars alphanumeric)
function generateInviteCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8);
}

// POST /api/squads — Create a new squad for a campaign
exports.create = async (req, res) => {
  try {
    const { campaign_id, name, target_amount } = req.body;

    if (!campaign_id || !name) {
      return res.status(400).json({ success: false, message: 'campaign_id dan name wajib diisi.' });
    }

    if (target_amount && target_amount < 10000) {
      return res.status(400).json({ success: false, message: 'Target squad minimal Rp 10.000.' });
    }

    // Check campaign exists and active
    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign || campaign.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Kampanye tidak tersedia atau sudah berakhir.' });
    }

    // Generate unique invite code
    let invite_code;
    let codeExists = true;
    while (codeExists) {
      invite_code = generateInviteCode();
      const existing = await Squad.findOne({ where: { invite_code } });
      codeExists = !!existing;
    }

    // Create squad
    const squad = await Squad.create({
      campaign_id,
      creator_id: req.user.id,
      name: name.trim(),
      target_amount: target_amount || campaign.target_amount,
      current_amount: 0,
      invite_code,
      status: 'active',
    });

    // Add creator as first member
    await SquadMember.create({
      squad_id: squad.id,
      user_id: req.user.id,
      role: 'creator',
    });

    res.status(201).json({
      success: true,
      message: 'Squad berhasil dibuat!',
      data: {
        squad: {
          ...squad.toJSON(),
          invite_url: `${process.env.FRONTEND_URL || 'http://localhost:5500'}/squad.html?code=${invite_code}`,
          member_count: 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat squad.', error: error.message });
  }
};

// GET /api/squads/code/:code — Get squad detail by invite code (public-ish)
exports.getByCode = async (req, res) => {
  try {
    const squad = await Squad.findOne({
      where: { invite_code: req.params.code },
      include: [
        { model: Campaign, as: 'campaign', attributes: ['id', 'title', 'banner_image', 'target_amount', 'current_amount', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        {
          model: SquadMember, as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!squad) {
      return res.status(404).json({ success: false, message: 'Squad tidak ditemukan.' });
    }

    // Get leaderboard (top donors in this squad)
    const leaderboard = await Donation.findAll({
      where: { squad_id: squad.id, status: 'success' },
      include: [{ model: User, as: 'donatur', attributes: ['id', 'name'] }],
      attributes: ['id', 'amount', 'is_anonymous', 'created_at', 'user_id'],
      order: [['amount', 'DESC']],
      limit: 20,
    });

    res.json({
      success: true,
      data: {
        squad,
        leaderboard: leaderboard.map(d => {
          const obj = d.toJSON();
          if (obj.is_anonymous) {
            obj.donatur = { id: null, name: 'Anonim' };
          }
          return obj;
        }),
        member_count: squad.members?.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat squad.', error: error.message });
  }
};

// GET /api/squads/:id — Get squad detail by ID
exports.getById = async (req, res) => {
  try {
    const squad = await Squad.findByPk(req.params.id, {
      include: [
        { model: Campaign, as: 'campaign', attributes: ['id', 'title', 'banner_image', 'target_amount', 'current_amount', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        {
          model: SquadMember, as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!squad) {
      return res.status(404).json({ success: false, message: 'Squad tidak ditemukan.' });
    }

    // Leaderboard
    const leaderboard = await Donation.findAll({
      where: { squad_id: squad.id, status: 'success' },
      include: [{ model: User, as: 'donatur', attributes: ['id', 'name'] }],
      attributes: ['id', 'amount', 'is_anonymous', 'created_at', 'user_id'],
      order: [['amount', 'DESC']],
      limit: 20,
    });

    res.json({
      success: true,
      data: {
        squad,
        leaderboard: leaderboard.map(d => {
          const obj = d.toJSON();
          if (obj.is_anonymous) obj.donatur = { id: null, name: 'Anonim' };
          return obj;
        }),
        member_count: squad.members?.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat squad.', error: error.message });
  }
};

// POST /api/squads/code/:code/join — Join a squad
exports.join = async (req, res) => {
  try {
    const squad = await Squad.findOne({
      where: { invite_code: req.params.code, status: 'active' },
    });

    if (!squad) {
      return res.status(404).json({ success: false, message: 'Squad tidak ditemukan atau sudah berakhir.' });
    }

    // Check if already a member
    const existing = await SquadMember.findOne({
      where: { squad_id: squad.id, user_id: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Anda sudah menjadi anggota squad ini.' });
    }

    // Add member
    await SquadMember.create({
      squad_id: squad.id,
      user_id: req.user.id,
      role: 'member',
    });

    // Notify squad creator
    await Notification.create({
      user_id: squad.creator_id,
      title: 'Anggota Baru di Squad!',
      message: `${req.user.name} bergabung ke squad "${squad.name}".`,
      type: 'system',
    });

    const memberCount = await SquadMember.count({ where: { squad_id: squad.id } });

    res.json({
      success: true,
      message: `Berhasil bergabung ke squad "${squad.name}"!`,
      data: { squad_id: squad.id, member_count: memberCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal bergabung ke squad.', error: error.message });
  }
};

// GET /api/squads/campaign/:campaignId — List squads for a campaign
exports.getByCampaign = async (req, res) => {
  try {
    const squads = await Squad.findAll({
      where: { campaign_id: req.params.campaignId },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        { model: SquadMember, as: 'members', attributes: ['id'] },
      ],
      order: [['current_amount', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        squads: squads.map(s => ({
          ...s.toJSON(),
          member_count: s.members?.length || 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar squad.', error: error.message });
  }
};

// GET /api/squads/my — Get squads user is a member of
exports.getMySquads = async (req, res) => {
  try {
    const memberships = await SquadMember.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Squad, as: 'squad',
        include: [
          { model: Campaign, as: 'campaign', attributes: ['id', 'title', 'banner_image'] },
          { model: SquadMember, as: 'members', attributes: ['id'] },
        ],
      }],
      order: [['joined_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        squads: memberships.map(m => ({
          ...m.squad.toJSON(),
          my_role: m.role,
          member_count: m.squad.members?.length || 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat squad Anda.', error: error.message });
  }
};
