const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const interactionController = {
  // Função para encontrar um usuário pelo número do WhatsApp
  findUserByWhatsappNumber: async (whatsappNumber) => {
    try {
      const user = await prisma.user.findUnique({
        where: { whatsappNumber },
      });

      if (!user) {
        return { exists: false, userId: null };
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
      const { whatsappNumber } = req.body;

      // Verificar se é uma nova conversa ou uma conversa ativa
      const activeChat = await prisma.chat.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date() - 24 * 60 * 60 * 1000), // Últimas 24 horas como exemplo
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (activeChat.length > 0) {
        // Conversa ativa - Analisar histórico e responder de acordo com os processos de comunicação
        // TODO: Implementação específica da lógica de negócio aqui
        return res
          .status(200)
          .json({ message: "Respondendo a conversa ativa." });
      } else {
        // Nova conversa - Enviar opções disponíveis ao usuário
        // TODO: verificar como enviar via whatsapp de forma option list
        return res.status(200).json({
          message:
            "Opções disponíveis: Comunidade, Perfil, Atividades, Eventos, Suporte, Carteira, Mercado, Notícias",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao analisar interações" });
    }
  },

  // Armazenar uma interação
  saveInteraction: async (req, res) => {
    try {
      const { userId, content } = req.body;

      const newInteraction = await prisma.interaction.create({
        data: {
          userId, // Assumindo que você tem uma relação com o usuário
          content, // Conteúdo da interação
        },
      });

      res.status(201).json({
        message: "Interação salva com sucesso!",
        interaction: newInteraction,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar a interação" });
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
