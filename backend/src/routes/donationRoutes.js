const router = require('express').Router();
const donationController = require('../controllers/donationController');
const { authenticate } = require('../middleware/auth');

router.get('/recent', donationController.getRecent); // Public
router.post('/', authenticate, donationController.create);
router.get('/', authenticate, donationController.getMyDonations);
router.get('/:id', authenticate, donationController.getById);

module.exports = router;
