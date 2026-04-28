const router = require('express').Router();
const withdrawalController = require('../controllers/withdrawalController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, isAdmin, withdrawalController.create);
router.get('/', authenticate, isAdmin, withdrawalController.getAll);
router.put('/:id', authenticate, isAdmin, withdrawalController.updateStatus);

module.exports = router;
