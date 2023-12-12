const { Configuration, OpenAI } = require("openai");
const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");



// verfica qual o flow da requisição



// Definição da função buildPromptWithFlows fora do openaiMiddleware
const buildPromptWithFlows = (chatHistory, currentMessage) => {
  let prompt =
    "Você é a assistente inteligente da Borogoland. Sua missão é identificar os dados do usuário e completar seu cadastro\n";

  // Adicionando mensagens do histórico ao prompt
  chatHistory.forEach((interaction) => {
    const role = interaction.sender === "user" ? "user" : "assistant";
    prompt += `${role}: ${interaction.message}\n`;
  });

  // Adicionando a mensagem atual
  prompt += `user: ${currentMessage}\n`;

  // Adicionando os marcadores dos fluxos
  prompt += `Fluxos: [ONBOARDING], [CONSULTAS], [PERFIL], [CURSOS], [MEMBROS], [EVENTOS], [INSTITUCIONAL], [BOROGOLAND], [SERVIÇOS], [WALLET]\n`;

  return prompt;
};

const openaiMiddleware = async (req, res, next) => {
  console.log("chegou no openaiMiddleware");

  if (req.response) {
    console.log("resposta já existe");
    next();
  } else {
    const userId = req.userId;

    if (req.whatsapp) {
      console.log("foi pra ai responder");

      const chatHistory = await chatController.getChatHistory(userId);
      console.log("histórico de chat:", chatHistory);
      const prompt = buildPromptWithFlows(chatHistory, req.whatsapp.msg_body);
      console.log("prompt:", prompt);

      const api = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        const completion = await api.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: prompt }],
        });

        const responseContent = completion.choices[0].message.content;
        console.log("Resposta da OpenAI:", responseContent);

        // Passo 3: Analisar a Resposta e Determinar o Fluxo
        let flow = "99"; // Valor padrão para o caso de não identificar um fluxo específico

        // Análise de resposta
        if (responseContent.includes("[ONBOARDING]")) {
          flow = "01";
        } else if (responseContent.includes("[CONSULTAS]")) {
          flow = "02";
        } else if (responseContent.includes("[PERFIL]")) {
          flow = "03";
        } else if (responseContent.includes("[CURSOS]")) {
          flow = "04";
        } else if (responseContent.includes("[MEMBROS]")) {
          flow = "05";
        } else if (responseContent.includes("[EVENTOS]")) {
          flow = "06";
        } else if (responseContent.includes("[INSTITUCIONAL]")) {
          flow = "07";
        } else if (responseContent.includes("[BOROGOLAND]")) {
          flow = "08";
        } else if (responseContent.includes("[SERVIÇOS]")) {
          flow = "09";
        } else if (responseContent.includes("[WALLET]")) {
          flow = "10";
        }

        // Configurar a resposta com base no fluxo determinado
        req.response = {
          message: responseContent, // A resposta real da OpenAI ou o menu de opções
          type: "text",
          flow: flow,
        };

        console.log("salvando resposta");
        await chatController.saveReplyMessage(userId, req.response.message);
        await interactionController.saveUserInteraction(
          userId,
          "RESPOSTA",
          false
        );

        next();
      } catch (e) {
        console.error("Erro ao interagir com a OpenAI: " + e);
        req.response = {
          message: "Desculpe, não entendi. Poderia repetir?",
          type: "text",
          flow: "99",
        };

        next();
      }
    }
  }
};

module.exports = openaiMiddleware;
