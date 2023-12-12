const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chatController = {
    // Armazenar uma mensagem de chat
    saveUserMessage: async (userId, message) => {
        try {
            const newMessage = await prisma.chat.create({
                data: {
                    userId,  // Assumindo que você tem uma relação com o usuário
                    message, 
                    createdByUser: true, // Assumindo que a mensagem foi enviada pelo usuário
                }
            });
        } catch (error) {
            console.log("Erro ao salvar mensagem de chat:", error);
        }
    },

    saveReplyMessage: async (userId, message) => {
        try {
            const newMessage = await prisma.chat.create({
                data: {
                    userId,  // Assumindo que você tem uma relação com o usuário
                    message, 
                    createdByUser: false, // Assumindo que a mensagem foi enviada pelo usuário
                }
            });
        } catch (error) {
            console.log("Erro ao salvar mensagem de chat:", error);
        }
    },

  // Recuperar histórico de chat de um usuário
  getChatHistory: async (req, res) => {
    try {
        const userId = req.userId;

        const chatHistory = await prisma.chat.findMany({
            where: {
                userId, // Assumindo que você tem uma relação com o usuário
            },
            take: 5, // Limita o resultado às últimas 5 conversas
            orderBy: {
                createdAt: 'desc' // Ordena as conversas pela data de criação, da mais recente para a mais antiga
            },
            select: {
                message: true // Seleciona apenas a coluna 'message'
            }
        });

        return chatHistory;
    } catch (error) {
      console.log("Erro ao buscar histórico de chat:", error);
    }
  },
};

module.exports = chatController;
