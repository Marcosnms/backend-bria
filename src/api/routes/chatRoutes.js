const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importar o authMiddleware

// Rota para armazenar uma mensagem de chat - Protegida por autenticação
router.post('/message', authMiddleware.verifyToken, chatController.saveChatMessage);

// Rota para recuperar o histórico de chat de um usuário - Protegida por autenticação
router.get('/history/:userId', authMiddleware.verifyToken, chatController.getChatHistory);

module.exports = router;
