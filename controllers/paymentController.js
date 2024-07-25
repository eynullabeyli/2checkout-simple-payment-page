const axios = require('axios');
const crypto = require('crypto');
const { generateHash } = require('../utils/generateHash');
const { merchantCode, secretKey } = require('../config/keys');

exports.processPayment = async (req, res) => {
    const { name, email, amount } = req.body;

    // Generate the current date in ISO 8601 format
    const date = new Date().toISOString();

    const dataString = `${merchantCode}${amount}USD${date}`;
    const hash = crypto.createHmac('sha256', secretKey)
                       .update(dataString)
                       .digest('hex');

    const paymentData = {
        "merchantCode": merchantCode,
        "currency": "USD",
        "amount": amount,
        "billingAddress": {
            "name": name,
            "email": email,
        }
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
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(401).send('Payment failed. Please check your credentials and try again.');
    }
};