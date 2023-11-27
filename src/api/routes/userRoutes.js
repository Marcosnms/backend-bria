const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para registro de novo usuário
router.post('/register', userController.createUserAccount);

// Rota para login do usuário
router.post('/login', userController.loginUser);

// Outras rotas relacionadas aos usuários podem ser adicionadas aqui
// Exemplo: Atualizar perfil, recuperar informações do usuário, etc.

module.exports = router;
