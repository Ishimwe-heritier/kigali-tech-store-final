const axios = require('axios');

async function testPaymentIntent() {
    try {
        const response = await axios.post('https://kigali-tech-store-final.onrender.com/api/create-payment-intent', {
            amount: 100
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testPaymentIntent();
