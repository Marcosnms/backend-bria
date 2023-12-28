const { OpenAI } = require("openai");
const chatController = require("../controllers/chatController");
const userController = require("../controllers/userController");
const interactionController = require("../controllers/interactionController");
const agentController = require("../controllers/agentController");

const openaiMiddleware = async (req, res, next) => {
  console.log("chegou no openaiMiddleware");

  if (req.response) {
    console.log("resposta já existe");
    next();
  } else {
    const userId = req.userId;
    console.log("userId", userId);
    if (req.whatsapp) {
      console.log("foi pra ai responder");

      const basicProfile = await userController.getBasicProfile(userId);
      console.log("basicProfile", basicProfile);
      const activeFlow = await userController.getActiveFlow(userId);
      console.log("activeFlow", activeFlow);
      const agent = await agentController.getAgent(userId, activeFlow);
      console.log("agent", agent.assistant);
      const thread = agent.thread;
      console.log("thread", thread);

      // realizar solicitação a openai com as instruções sobre o usuário como "additional_instructions"
      const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        // adiciona a mensagem do usuário
        async function addMessage() {
          const message = await api.beta.threads.messages.create(thread, {
            role: "user",
            content: req.whatsapp.msg_body,
          });
          console.log("Mensagem adicionada");
          return;
        }
        await addMessage();

        // run assistant
        async function runAssistant() {
          const run = await api.beta.threads.runs.create(thread, {
            assistant_id: agent.assistant,
            additional_instructions: basicProfile,
          });
          console.log("Run criado", run);

          // aguarda a execução do run


         return ;
        }
        await runAssistant();




        // envia a resposta
        req.response = {
          message: "em breve respondo",
          type: "text",
          flow: activeFlow, // Varia de acordo com o fluxo atual
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
    console.log("salvando resposta da AI");
    await chatController.saveReplyMessage(userId, req.response.message);
    await interactionController.saveUserInteraction(userId, "RESPOSTA");
    next();
  }
};

module.exports = openaiMiddleware;
