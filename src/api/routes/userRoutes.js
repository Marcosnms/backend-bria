const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware de autenticação

const router = express.Router();

// Teste server
router.post('/', userController.teste); // Teste server

// Chat 



// Onboarding e Gerenciamento de Conta
router.post('/register', userController.createUserAccount); // Cria uma nova conta de usuário
router.post('/login', userController.loginUser); // Autentica um usuário
router.get('/verify/:token', userController.verifyAccount); // Verifica a conta de usuário

// Perfil de Usuário
router.get('/profile/:userId', authMiddleware.verifyToken, userController.getUserProfile); // Obtém o perfil do usuário
router.put('/profile/:userId', authMiddleware.verifyToken, userController.updateUserProfile); // Atualiza o perfil do usuário
router.post('/profile/picture', authMiddleware.verifyToken, userController.uploadProfilePicture); // Carrega uma foto de perfil


module.exports = router;
