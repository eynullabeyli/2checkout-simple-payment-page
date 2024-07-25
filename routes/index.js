const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Render the payment form
router.get('/', (req, res) => {
    res.render('index');
});

// Process the payment
router.post('/process-payment', paymentController.processPayment);

module.exports = router;