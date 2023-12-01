const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const interactionController = {
  // OK Função para encontrar um usuário pelo número do WhatsApp
  findUserByWhatsappNumber: async (whatsappNumber) => {
    try {
      const user = await prisma.user.findUnique({
        where: { whatsappNumber },
      });

      if (!user) {
        return { exists: null, userId: null };
      }

      return { exists: true, userId: user.id };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  },

  // Analisar interações de um usuário
  analyzeInteractions: async (req, res) => {
    try {
      // Verificar se é uma nova conversa ou uma conversa ativa
      const activeChat = await prisma.chat.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (activeChat.length > 0) {
        // Conversa ativa
        console.log("conversa ativa");

        return res.status(200).json({ message: "Conversa já em andamento" });
      } else {
        // Nova conversa
        console.log("nova conversa");
        // Lógica para nova conversa (a mensagem será enviada em outro lugar)
        return res.status(200).json({ message: "Nova conversa detectada." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao analisar interações" });
    }
  },

  // Armazenar uma interação
  saveInteraction: async (req) => {
    try {
      const { userId, content } = req.body;

      const newInteraction = await prisma.interaction.create({
        data: {
          userId, // Assumindo que você tem uma relação com o usuário
          content, // Conteúdo da interação
        },
      });

      console.log("interação salva");
    } catch (error) {
      console.log("Erro ao salvar interação:", error);
    }
  },

  // Recuperar histórico de chat de um usuário
  getChatHistory: async (req, res) => {
    try {
      const { userId } = req.params;

      const chatHistory = await prisma.chat.findMany({
        where: {
          userId, // Assumindo que você tem uma relação com o usuário
        },
      });

      res.status(200).json({ chatHistory });
    } catch (error) {
      res.status(500).json({ error: "Erro ao recuperar o histórico de chat" });
    }
  },
};

module.exports = interactionController;
