const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware de autenticação

const router = express.Router();

// Teste server
router.post('/teste', userController.teste); // Teste server

// Chat 

module.exports = router;
