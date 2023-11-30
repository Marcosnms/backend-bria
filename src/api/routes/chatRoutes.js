const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


// Rota para armazenar uma mensagem de chat - Protegida por autenticação
router.post('/message', chatController.saveChatMessage);

// Rota para recuperar o histórico de chat de um usuário - Protegida por autenticação
router.get('/history/:userId',chatController.getChatHistory);

module.exports = router;
