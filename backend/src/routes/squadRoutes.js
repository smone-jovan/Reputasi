const router = require('express').Router();
const squadController = require('../controllers/squadController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSquadSchema } = require('../validations/squadValidation');

// Public routes
router.get('/code/:code', squadController.getByCode);
router.get('/campaign/:campaignId', squadController.getByCampaign);

// Authenticated routes
router.post('/', authenticate, validate(createSquadSchema), squadController.create);
router.post('/code/:code/join', authenticate, squadController.join);
router.get('/my', authenticate, squadController.getMySquads);
router.get('/:id', squadController.getById);

module.exports = router;
