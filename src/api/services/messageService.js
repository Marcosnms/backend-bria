const axios = require('axios');

async function enviarTexto (whatsappNumber, whatsapp_token, to, message) {
    try {
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

// Uso da função
enviarTexto ('SEU_NUMERO_WHATSAPP', 'SEU_TOKEN_WHATSAPP', 'NUMERO_DESTINO', 'Olá, esta é uma mensagem do WhatsApp!');
