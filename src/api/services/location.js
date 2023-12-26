const axios = require('axios');

const getLocation = async () => {
    try {
        const response = await axios.get('https://ipapi.co/json/', {
            headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

module.exports = getLocation;
