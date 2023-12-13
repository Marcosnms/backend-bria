const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const interactionController = {
  // Função para encontrar um usuário pelo número do WhatsApp - ok
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
          userId: req.userId,
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

        return { conversa: "ativa" };
      } else {
        // Nova conversa
        console.log("nova conversa");

        return { conversa: "nova" };
      }
    } catch (error) {
      console.log("Erro ao analisar interações:", error);
    }
  },

  // Armazenar uma interação
  saveUserInteraction: async (userId, content, createdByUser) => {
    try {
      if (!userId || !content) {
        throw "Dados insuficientes para salvar interação";
      } else {
        const newInteraction = await prisma.interaction.create({
          data: {
            userId, // Assumindo que você tem uma relação com o usuário
            content, // Conteúdo da interação
            createdByUser, // Se a interação foi criada pelo usuário
          },
        });
      }
      console.log("interação salva");
    } catch (error) {
      console.log("Erro ao salvar interação:", error);
    }
  },

  // Verificar o fluxo ativo de um usuário
  getActiveFlow: async (userId) => {
    try {
      // Exemplo: assumindo que existe um campo 'activeFlow' no modelo 'User'
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { activeFlow: true }, // Selecionando apenas o campo 'activeFlow'
      });

      if (!user) {
        throw "Usuário não encontrado";
      }

      return user.activeFlow; // Retornando o fluxo ativo do usuário
    } catch (error) {
      console.error("Erro ao obter o fluxo ativo do usuário:", error);
      throw error;
    }
  }
};

module.exports = interactionController;
