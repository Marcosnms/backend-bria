const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chatController = {
    // Armazenar uma mensagem de chat
    saveChatMessage: async (req, res) => {
        try {
            const { userId, message } = req.body;

            const newMessage = await prisma.chat.create({
                data: {
                    userId,  // Assumindo que você tem uma relação com o usuário
                    message
                }
            });

            res.status(201).json({ message: "Mensagem de chat salva com sucesso!", chat: newMessage });
        } catch (error) {
            res.status(500).json({ error: "Erro ao salvar a mensagem de chat" });
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
