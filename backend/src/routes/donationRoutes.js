const router = require('express').Router();
const donationController = require('../controllers/donationController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createDonationSchema } = require('../validations/donationValidation');

router.get('/recent', donationController.getRecent);
router.post('/', authenticate, validate(createDonationSchema), donationController.create);
router.get('/', authenticate, donationController.getMyDonations);
router.get('/:id', authenticate, donationController.getById);

module.exports = router;
