const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Importação de rotas
const userRoutes = require('./src/api/routes/userRoutes');
const chatRoutes = require('./src/api/routes/chatRoutes');
const interactionRoutes = require('./src/api/routes/interactionRoutes');

// Importação de middlewares
const whatsappMiddleware = require('./src/api/middlewares/whatsappMiddleware');
const openaiMiddleware = require('./src/api/middlewares/openaiMiddleware');

// Configuração do dotenv
dotenv.config();

// Inicializa o aplicativo Express
const app = express();

// Middleware para CORS, BodyParser e JSON
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar rotas da API
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/interactions', interactionRoutes);

// Rota de webhook para o WhatsApp
app.post('/webhook', whatsappMiddleware, openaiMiddleware, (req, res) => {
    if (req.whatsapp && req.openaiResponse) {
        const { phone_number_id, from } = req.whatsapp;
        const replyMessage = req.openaiResponse;
        whatsappMiddleware.sendReply(phone_number_id, process.env.WHATSAPP_TOKEN, from, replyMessage, res);
    } else {
        res.status(500).send('Erro ao processar a mensagem');
    }
});

// Rota de verificação do webhook (necessária para a configuração inicial do webhook)
app.get("/webhook", (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Rota de teste (opcional)
app.get('/', (req, res) => {
    res.send('Backend BRIA está funcionando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
