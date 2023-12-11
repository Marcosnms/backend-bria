const { Configuration, OpenAI } = require("openai");
const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");

const openaiMiddleware = async (req, res, next) => {
  console.log("chegou no openaiMiddleware");

  if (req.response) {
    console.log("resposta já existe");
    next();

  } else {

    // TODO: validar o tipo de FLOW da conversa
    // Flow 01: onboarding
    // Flow 02: consultas
    // Flow 03: perfil
    // Flow 04: cursos
    // Flow 05: membros
    // Flow 06: eventos
    // Flow 07: serviços
    // Flow 08: wallet
    
    const { userId, lastMesages } = req.user;

    // Recuperar o histórico de chat
    const chatHistory = await chatController.getChatHistory({ userId });

    // Pega apenas as últimas 5 interações
    const lastInteractions = chatHistory.slice(-5);

    if (req.whatsapp) {
      console.log("foi pra ai responder");
      const api = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const messages = [
          {
            role: "system",
            content: "Você é a assistente inteligente da Borogoland.",
          },
          ...lastInteractions.map(interaction => ({
            role: interaction.sender === 'user' ? 'user' : 'assistant',
            content: interaction.message,
          })),
          {
            role: "user",
            content: req.whatsapp.msg_body,
          },
        ];

        const completion = await api.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages,
        });

        // Lógica para decidir se envia a resposta ou o menu de opções
        const responseContent = completion.choices[0].message.content;

        // Implementar lógica de análise de intenção aqui
        // Exemplo: Se a intenção for clara, enviar resposta; se não, enviar menu

        req.response = {
          message: responseContent, // ou menu de opções
          type: "text",
          flow: "03", // Ajuste conforme necessário
        };

        console.log("Resposta:", req.response);
      } catch (e) {
        console.error("Erro ao interagir com a OpenAI: " + e);
        req.response = {
          message: "Desculpe, não entendi. Poderia repetir?",
          type: "text",
          flow: "99",
        };
      }
    }

    // Salva a resposta gerada
    console.log("salvando resposta");
    await chatController.saveReplyMessage(userId, req.response.message);
    await interactionController.saveUserInteraction(userId, "RESPOSTA", false);

    next();
  }
};


module.exports = openaiMiddleware;
