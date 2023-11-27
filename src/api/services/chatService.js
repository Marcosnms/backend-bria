const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chatService = {
    // Armazenar uma mensagem de chat
    saveChatMessage: async (userId, message) => {
        return prisma.chat.create({
            data: {
                userId,
                message
            }
        });
    },

    // Recuperar o histórico de chat de um usuário
    getChatHistory: async (userId) => {
        return prisma.chat.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

};

module.exports = chatService;
