const https = require('https');

const whatsappMiddleware = (req, res, next) => {
    // Verifica se a solicitação vem do webhook do WhatsApp
    if (req.body.object && req.body.entry && req.body.entry[0].changes && req.body.entry[0].changes[0]) {
        // Extrai informações importantes da mensagem
        const messageData = req.body.entry[0].changes[0].value;
        const phone_number_id = messageData.metadata.phone_number_id;
        const from = messageData.messages[0].from;
        const msg_body = messageData.messages[0].text.body;

        // Anexa as informações extraídas à solicitação para uso posterior
        req.whatsapp = {
            phone_number_id,
            from,
            msg_body
        };
        next();
    } else {
        // Se não for uma solicitação válida do WhatsApp, retorna um erro 404
        res.sendStatus(404);
    }
};

// Função auxiliar para enviar resposta via WhatsApp
whatsappMiddleware.sendReply = (phone_number_id, whatsapp_token, to, reply_message, response) => {
    const postData = JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        text: { body: reply_message },
    });

    const requestOptions = {
        hostname: "graph.facebook.com",
        path: `/v16.0/${phone_number_id}/messages?access_token=${whatsapp_token}`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": postData.length
        }
    };

    const req = https.request(requestOptions, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    // Escreve os dados no corpo da requisição
    req.write(postData);
    req.end();

    // Envia uma resposta 200 para o WhatsApp
    response.sendStatus(200);
};

module.exports = whatsappMiddleware;
