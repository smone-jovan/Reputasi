const router = require('express').Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { Setting } = require('../models');

// POST /api/admin/test-mode — toggle test mode (admin only)
router.post('/test-mode', authenticate, isAdmin, async (req, res) => {
  try {
    const current = await Setting.getValue('test_mode', false);
    const newValue = !current;

    await Setting.setValue('test_mode', newValue, 'boolean');

    res.json({
      success: true,
      message: newValue ? 'Test Mode diaktifkan. Semua donasi akan langsung bypass.' : 'Test Mode dinonaktifkan.',
      data: { enabled: newValue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal toggle test mode.', error: error.message });
  }
});

// GET /api/admin/test-mode — get test mode status (admin only)
router.get('/test-mode', authenticate, isAdmin, async (req, res) => {
  try {
    const enabled = await Setting.getValue('test_mode', false);
    res.json({ success: true, data: { enabled } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil status test mode.', error: error.message });
  }
});

module.exports = router;
