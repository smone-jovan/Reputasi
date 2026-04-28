const router = require('express').Router();
const campaignController = require('../controllers/campaignController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', campaignController.getAll);
router.get('/:id', campaignController.getById);
router.get('/:id/donors', campaignController.getDonors);
router.post('/', authenticate, isAdmin, campaignController.create);
router.put('/:id', authenticate, isAdmin, campaignController.update);
router.delete('/:id', authenticate, isAdmin, campaignController.delete);

module.exports = router;
