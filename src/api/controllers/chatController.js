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
            const { userId } = req.params;

            const chatHistory = await prisma.chat.findMany({
                where: {
                    userId  // Assumindo que você tem uma relação com o usuário
                }
            });

            res.status(200).json({ chatHistory });
        } catch (error) {
            res.status(500).json({ error: "Erro ao recuperar o histórico de chat" });
        }
    },

    // Outros métodos relacionados a chat podem ser adicionados aqui
};

module.exports = chatController;
