const crypto = require('crypto');

exports.generateHash = (merchantCode, amount, date, secretKey) => {
    const dataString = `${merchantCode}${amount}USD${date}`;
    return crypto.createHmac('sha256', secretKey)
                 .update(dataString)
                 .digest('hex');
};