const router = require('express').Router();
const squadController = require('../controllers/squadController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/code/:code', squadController.getByCode);
router.get('/campaign/:campaignId', squadController.getByCampaign);

// Authenticated routes
router.post('/', authenticate, squadController.create);
router.post('/code/:code/join', authenticate, squadController.join);
router.get('/my', authenticate, squadController.getMySquads);
router.get('/:id', squadController.getById);

module.exports = router;
