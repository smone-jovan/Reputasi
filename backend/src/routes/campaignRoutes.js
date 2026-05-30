const router = require('express').Router();
const campaignController = require('../controllers/campaignController');
const { authenticate, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { submitCampaignSchema, updateMyCampaignSchema } = require('../validations/campaignValidation');

// Public
router.get('/', campaignController.getAll);

// User-authenticated (specific paths BEFORE /:id)
router.post('/submit', authenticate, validate(submitCampaignSchema), campaignController.submit);
router.get('/my', authenticate, campaignController.getMy);
router.put('/my/:id', authenticate, validate(updateMyCampaignSchema), campaignController.updateMy);

// Public with :id
router.get('/:id', campaignController.getById);
router.get('/:id/donors', campaignController.getDonors);

// Admin only
router.post('/', authenticate, isAdmin, campaignController.create);
router.put('/:id', authenticate, isAdmin, campaignController.update);
router.put('/:id/approve', authenticate, isAdmin, campaignController.approve);
router.put('/:id/reject', authenticate, isAdmin, campaignController.reject);
router.post('/:id/resubmit', authenticate, campaignController.resubmit);
router.delete('/:id', authenticate, isAdmin, campaignController.delete);

module.exports = router;
