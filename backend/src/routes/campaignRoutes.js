const router = require('express').Router();
const campaignController = require('../controllers/campaignController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public
router.get('/', campaignController.getAll);

// User-authenticated (must be before /:id)
router.post('/submit', authenticate, campaignController.submit);
router.get('/my', authenticate, campaignController.getMy);

// Public with :id
router.get('/:id', campaignController.getById);
router.get('/:id/donors', campaignController.getDonors);

// Admin only
router.post('/', authenticate, isAdmin, campaignController.create);
router.put('/:id', authenticate, isAdmin, campaignController.update);
router.put('/:id/approve', authenticate, isAdmin, campaignController.approve);
router.put('/:id/reject', authenticate, isAdmin, campaignController.reject);
router.delete('/:id', authenticate, isAdmin, campaignController.delete);

module.exports = router;
