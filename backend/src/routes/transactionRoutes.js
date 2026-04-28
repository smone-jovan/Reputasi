const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Tripay webhook (no auth - Tripay calls this)
router.post('/callback', transactionController.callback);

// Check payment status (public with order_id)
router.get('/check/:orderId', transactionController.checkStatus);

// Admin routes
router.get('/', authenticate, isAdmin, transactionController.getAll);
router.get('/:id', authenticate, transactionController.getById);

module.exports = router;
