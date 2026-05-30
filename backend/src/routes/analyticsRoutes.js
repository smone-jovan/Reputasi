const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/trend', authenticate, isAdmin, analyticsController.trend);
router.get('/top-campaigns', authenticate, isAdmin, analyticsController.topCampaigns);
router.get('/top-donors', authenticate, isAdmin, analyticsController.topDonors);

module.exports = router;
