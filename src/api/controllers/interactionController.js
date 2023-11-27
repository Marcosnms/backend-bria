const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const interactionController = {
    // Armazenar uma interação
    saveInteraction: async (req, res) => {
        try {
            const { userId, content } = req.body;

            const newInteraction = await prisma.interaction.create({
                data: {
                    userId,  // Assumindo que você tem uma relação com o usuário
                    content  // Conteúdo da interação
                }
            });

            res.status(201).json({ message: "Interação salva com sucesso!", interaction: newInteraction });
        } catch (error) {
            res.status(500).json({ error: "Erro ao salvar a interação" });
        }
    },

    // Analisar interações de um usuário
    analyzeInteractions: async (req, res) => {
        try {
            const { whatsappNumber } = req.body;

            // Verificar se o número do WhatsApp existe
            const user = await prisma.user.findUnique({
                where: { whatsappNumber }
            });

            if (!user) {
                // Número do WhatsApp não encontrado - Encaminhar para rota de saudação e cadastro
                // TODO: direcionar o usuário para o fluxo de cadastro.
                return res.status(200).json({ message: "Usuário não encontrado. Iniciar processo de cadastro." });
            }

            // Verificar se é uma nova conversa ou uma conversa ativa
            const activeChat = await prisma.chat.findMany({
                where: { 
                    userId: user.id,
                    createdAt: {
                        gte: new Date(new Date() - 24 * 60 * 60 * 1000) // Últimas 24 horas como exemplo
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (activeChat.length > 0) {
                // Conversa ativa - Analisar histórico e responder de acordo com os processos de comunicação
                // TODO: Implementação específica da lógica de negócio aqui
                return res.status(200).json({ message: "Respondendo a conversa ativa." });
            } else {
                // Nova conversa - Enviar opções disponíveis ao usuário
                // TODO: verificar como enviar via whatsapp de forma option list
                return res.status(200).json({ 
                    message: "Opções disponíveis: Comunidade, Perfil, Atividades, Eventos, Suporte, Carteira, Mercado, Notícias" 
                });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao analisar interações" });
        }
    },

    // Outros métodos relacionados a interações podem ser adicionados aqui
};

module.exports = interactionController;
