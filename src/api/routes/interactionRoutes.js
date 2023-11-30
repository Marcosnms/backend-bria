const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

// Rota para salvar uma interação
router.post('/save', interactionController.saveInteraction);

// Rota para analisar interações de um usuário
router.get('/analyze/:userId', interactionController.analyzeInteractions);


module.exports = router;
