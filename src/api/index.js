const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definir rotas para as funções do usuário
router.post('/create', userController.createUserAccount);
router.post('/verify', userController.verifyIdentity);
router.put('/preferences', userController.updateUserPreferences);

// ... continuar para as outras rotas

module.exports = router;