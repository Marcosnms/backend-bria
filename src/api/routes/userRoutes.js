const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assegure-se de criar este middleware

const router = express.Router();

// Onboarding e Gerenciamento de Conta
router.post('/register', userController.createUserAccount); // Cria uma nova conta de usuário
router.post('/login', userController.loginUser); // Autentica um usuário
router.get('/verify/:token', userController.verifyAccount); // Verifica a conta de usuário

// Perfil de Usuário
router.get('/profile/:userId', authMiddleware.verifyToken, userController.getUserProfile); // Obtém o perfil do usuário
router.put('/profile/:userId', authMiddleware.verifyToken, userController.updateUserProfile); // Atualiza o perfil do usuário
router.post('/profile/picture', authMiddleware.verifyToken, userController.uploadProfilePicture); // Carrega uma foto de perfil

// Atividades e Interesses
router.get('/activities', userController.listAvailableActivities); // Lista atividades disponíveis
router.post('/activities/interests', authMiddleware.verifyToken, userController.updateUserInterests); // Atualiza interesses do usuário
router.get('/activities/recommendations', authMiddleware.verifyToken, userController.recommendActivities); // Recomenda atividades

// Eventos e Participação
router.get('/events', userController.listEvents); // Lista eventos
router.post('/events/register', authMiddleware.verifyToken, userController.registerForEvent); // Inscreve o usuário em um evento
router.post('/events/:eventId/vote', authMiddleware.verifyToken, userController.participateInVoting); // Participação em votações de evento

// Comunicação e Interação Social
router.post('/messages/send', authMiddleware.verifyToken, userController.sendMessage); // Envia mensagens
router.post('/discussions/join', authMiddleware.verifyToken, userController.joinDiscussionGroup); // Inscreve em grupos de discussão
router.post('/ideas/share', authMiddleware.verifyToken, userController.shareIdeas); // Compartilha ideias

// Suporte e Ajuda
router.get('/support/faq', userController.getFAQs); // Obtém FAQs
router.post('/support/ticket', authMiddleware.verifyToken, userController.createSupportTicket); // Cria ticket de suporte

// Feedback e Performance
router.get('/performance', authMiddleware.verifyToken, userController.getUserPerformance); // Obtém performance do usuário
router.post('/feedback', authMiddleware.verifyToken, userController.giveFeedback); // Fornece feedback

module.exports = router;
