const { body, validationResult } = require('express-validator');
const axios = require('axios');
const { generateHash } = require('../utils/generateHash');
const { merchantCode, secretKey, mode } = require('../config/keys');

// Define validation and sanitization rules
const validatePayment = [
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('cardNumber').isCreditCard().withMessage('Valid card number is required'),
    body('expMonth').isInt({ min: 1, max: 12 }).withMessage('Valid expiration month is required'),
    body('expYear').isInt({ min: new Date().getFullYear() % 100, max: 99 }).withMessage('Valid expiration year is required'),
    body('cvv').isLength({ min: 3, max: 4 }).isNumeric().withMessage('Valid CVV is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero')
];

exports.processPayment = [
    validatePayment,
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('payment-response', { errors: errors.array() });
        }

        const { name, email, cardNumber, expMonth, expYear, cvv, amount } = req.body;
        const date = new Date().toISOString();
        const hash = generateHash(merchantCode, amount, date, secretKey);

        const paymentData = {
            "merchantCode": merchantCode,
            "currency": "USD",
            "amount": amount,
            "billingAddress": {
                "name": name,
                "email": email,
            },
            "paymentMethod": {
                "cardNumber": cardNumber,
                "expMonth": expMonth,
                "expYear": expYear,
                "cvv": cvv
            }
        };

        try {
            const response = await axios.post(apiUrl, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Avangate-Authentication': `code=${merchantCode}, date=${date}, hash=${hash}`
                }
            });

            // Render the card details in the UI
            res.render('payment-response', { cardInfo: response.data });
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            res.render('payment-response', { error: error.response ? error.response.data : error.message });
        }
    }
];