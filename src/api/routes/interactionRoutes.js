const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importar o authMiddleware

// Rota para salvar uma interação - Protegida por autenticação
router.post('/', authMiddleware.verifyToken, interactionController.saveInteraction);

// Rota para analisar interações de um usuário - Protegida por autenticação
router.get('/analyze/:userId', authMiddleware.verifyToken, interactionController.analyzeInteractions);


module.exports = router;
