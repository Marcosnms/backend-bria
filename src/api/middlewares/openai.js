
const { Configuration, OpenAI } = require("openai");
const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");



const openaiMiddleware = async (req, res, next) => {
  console.log("chegou no openaiMiddleware");
 
  // Caso a resposta já exista, não é necessário chamar a OpenAI novamente
  if (req.response) {
    console.log("resposta já existe");
    next();
   
  } else {
    const userId = req.userId;
    if (req.whatsapp) {
      console.log("foi pra ai responder");
      const api = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      try {
        const completion = await api.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Você é a assistente inteligente da Borogoland.",

            },
            {
              role: "user",
              content: req.whatsapp.msg_body,
            },
          ],
        });
        req.response = {
          message: completion.choices[0].message.content,
          type: "text",
          flow: "03",
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
    await interactionController.saveUserInteraction(userId, "RESPOSTA");
    next();
  }
};
module.exports = openaiMiddleware;
