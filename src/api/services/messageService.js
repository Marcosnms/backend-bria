const axios = require('axios');

const messageService = async (whatsappNumber, whatsapp_token, to, message) => {
    try {
        console.log("chegou no messageService")
        console.log(whatsappNumber, whatsapp_token, to, message)   
        const data = {
            messaging_product: "whatsapp",
            to: to,
            text: { body: message }
        };

        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${whatsappNumber}/messages`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${whatsapp_token}`
                }
            }
        );

        console.log('Mensagem enviada com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

module.exports = messageService;