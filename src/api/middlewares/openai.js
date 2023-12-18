const { Configuration, OpenAI } = require("openai");
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");
const interactionController = require("../controllers/interactionController");

const openaiMiddleware = async (req, res, next) => {
  console.log("chegou no openaiMiddleware");

  if (req.response) {
    console.log("resposta já existe");
    next();
  } else {
    const userId = req.userId;
    if (req.whatsapp) {
      console.log("foi pra ai responder");

      const basicProfile = await userController.getBasicProfile(userId);
      const activeFlow = await userController.getOpenFlow(userId);
      const chatHistory = await chatController.getChatHistory(userId);

      const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const prompt = `Você é a BRIA, a assistente inteligente da Borogoland. Sua função é responder as perguntas de forma educada, simpatica, positiva e alegre.
         Você está conversando com o usuário: ${JSON.stringify(basicProfile)}.\n
         Você está respondendo uma pergunta relacionada ao fluxo de: ${activeFlow}.\n
         Você está respondendo uma pergunta relacionada ao contexto no qual as últimas frases do usuário foram {${chatHistory}}.\n
         Seu objetivo é ajudar o usuário a completar o fluxo que ele se encontra de forma orientativa e explicativa.\n;`;

        console.log("prompt", prompt);

        const completion = await api.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: prompt, name: "BRIA" },
            { role: "user", content: req.whatsapp.msg_body},],
        });

        let responseContent = completion.choices[0].message.content;

        // Por exemplo, verificar palavras-chave ou sentimentos e ajustar conforme necessário

        req.response = {
          message: responseContent,
          type: "text",
          flow: "conversa", 
        };
        console.log("Resposta:", req.response);
      } catch (e) {
        console.error("Erro ao interagir com a OpenAI:", e);
        req.response = {
          message: "Desculpe, não entendi. Poderia repetir?",
          type: "text",
          flow: "99",
        };
      }
    }
    console.log("salvando resposta");
    await chatController.saveReplyMessage(userId, req.response.message);
    await interactionController.saveUserInteraction(userId, "RESPOSTA");
    next();
  }
};

module.exports = openaiMiddleware;
