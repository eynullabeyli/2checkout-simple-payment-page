require('dotenv').config();

module.exports = {
    merchantCode: process.env.MERCHANT_CODE,
    secretKey: process.env.SECRET_KEY,
    mode: process.env.MODE // 'test' or 'live'
};