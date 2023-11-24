const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUserAccount = async (req, res) => {
  const { name, email, whatsappNumber, privateKey } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(privateKey, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        whatsappNumber,
        privateKey: hashedPassword,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { whatsappNumber, privateKey } = req.body;

  try {
    // Encontre o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: {
        whatsappNumber: whatsappNumber
      }
    });

    // Se não encontrar o usuário, retorne erro
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Compare a senha fornecida com a senha hash salva no banco de dados
    const isMatch = await bcrypt.compare(privateKey, user.privateKey);
    
    // Se a senha não corresponder, retorne erro
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha inválida.' });
    }
    
    // Se as credenciais estiverem corretas, crie um JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }, // Define a validade do token
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor ao tentar logar.' });
  }
};

exports.verifyAccount = async (req, res) => {
  // Implemente a lógica de verificação de conta aqui
};

exports.getUserProfile = async (req, res) => {
  // Implemente a lógica para obter o perfil do usuário aqui
};

exports.updateUserProfile = async (req, res) => {
  // Implemente a lógica para atualizar o perfil do usuário aqui
};

exports.uploadProfilePicture = async (req, res) => {
  // Implemente a lógica para upload da foto do perfil aqui
};

exports.listAvailableActivities = async (req, res) => {
  // Implemente a lógica para listar atividades disponíveis aqui
};

exports.updateUserInterests = async (req, res) => {
  // Implemente a lógica para atualizar interesses do usuário aqui
};

exports.recommendActivities = async (req, res) => {
  // Implemente a lógica para recomendar atividades aqui
};

exports.listEvents = async (req, res) => {
  // Implemente a lógica para listar eventos aqui
};

exports.registerForEvent = async (req, res) => {
  // Implemente a lógica para registrar um usuário em um evento aqui
};

exports.participateInVoting = async (req, res) => {
  // Implemente a lógica para participar em votações aqui
};

exports.sendMessage = async (req, res) => {
  // Implemente a lógica para enviar mensagens aqui
};

exports.joinDiscussionGroup = async (req, res) => {
  // Implemente a lógica para ingressar em grupos de discussão aqui
};

exports.shareIdeas = async (req, res) => {
  // Implemente a lógica para compartilhar ideias aqui
};

exports.getFAQs = async (req, res) => {
  // Implemente a lógica para obter FAQs aqui
};

exports.createSupportTicket = async (req, res) => {
  // Implemente a lógica para criar um ticket de suporte aqui
};

exports.getUserPerformance = async (req, res) => {
  // Implemente a lógica para obter a performance do usuário aqui
};

exports.giveFeedback = async (req, res) => {
  // Implemente a lógica para fornecer feedback aqui
};
