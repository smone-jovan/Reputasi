const { Notification } = require('../models');

// GET /api/notifications
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { user_id: req.user.id, is_read: false },
    });

    res.json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi.', error: error.message });
  }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notifikasi tidak ditemukan.' });
    }

    await notif.update({ is_read: true });

    res.json({ success: true, message: 'Notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui notifikasi.', error: error.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );

    res.json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui notifikasi.', error: error.message });
  }
};
