const axios = require('axios');
const { generateHash } = require('../utils/generateHash');
const { merchantCode, secretKey } = require('../config/keys');

exports.processPayment = async (req, res) => {
    const { name, email, amount } = req.body;
    const date = new Date().toISOString();
    const hash = generateHash(merchantCode, amount, date, secretKey);

    // Payment data
    const paymentData = {
        "merchantCode": merchantCode,
        "currency": "USD",
        "amount": amount,
        "billingAddress": {
            "name": name,
            "email": email,
        },
    };

    try {
        const response = await axios.post('https://api.2checkout.com/rest/6.0/orders/', paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Avangate-Authentication': `code=${merchantCode}, date=${date}, hash=${hash}`
            }
        });
        res.send('Payment processed successfully!');
    } catch (error) {
        console.error(error.response.data);
        res.send('Payment failed.');
    }
};