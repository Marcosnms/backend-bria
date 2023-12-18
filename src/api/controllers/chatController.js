const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const chatController = {
  // Armazenar uma mensagem de chat
  saveUserMessage: async (userId, message) => {
    try {
      const newMessage = await prisma.chat.create({
        data: {
          userId, // Assumindo que você tem uma relação com o usuário
          message,
          createdByUser: true, // Assumindo que a mensagem foi enviada pelo usuário
        },
      });
    } catch (error) {
      console.log("Erro ao salvar mensagem de chat:", error);
    }
  },

  saveReplyMessage: async (userId, message) => {
    try {
      const newMessage = await prisma.chat.create({
        data: {
          userId, // Assumindo que você tem uma relação com o usuário
          message,
          createdByUser: false, // Assumindo que a mensagem foi enviada pelo usuário
        },
      });
    } catch (error) {
      console.log("Erro ao salvar mensagem de chat:", error);
    }
  },

  // Recuperar histórico de chat de um usuário
  getChatHistory: async (userId) => {
    try {
      const chatHistory = await prisma.chat.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          message: true,
        },
      });
      console.log("historico de chat", chatHistory);
      const messages = chatHistory.map(chat => chat.message);
      const combinedMessages = messages.join('\n');


      return combinedMessages;

    } catch (error) {
      console.error("Erro ao buscar histórico de chat:", error);
      return ""; // Retornando uma string vazia em caso de erro
    }
  },
};

module.exports = chatController;
