const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


// Rota para armazenar uma mensagem de chat 
router.post('/message', chatController.saveUserMessage);

router.post('/reply', chatController.saveReplyMessage);

// Rota para recuperar o histórico de chat de um usuário 
router.get('/history/:userId',chatController.getChatHistory);


module.exports = router;
