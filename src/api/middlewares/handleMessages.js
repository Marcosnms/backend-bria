const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");
const userController = require("../controllers/userController");

const handleMessages = async (req, res, next) => {
  console.log("chegou no handleMessages");
  const { from, name, msg_body } = req.whatsapp;

  try {
    // OK Verificar se usuário existe e buscar o id dele
    const { exists, userId } =
      await interactionController.findUserByWhatsappNumber(from);

    if (!exists) {
      // OK: Usuário não encontrado, criar conta
      console.log("usuário não existe");
      const createUserReq = {
        body: {
          name: name, // Supondo que 'name' esteja disponível em req.whatsapp
          whatsappNumber: from,
          privateKey: "Borogoland@954:)", // Substitua com o valor real conforme necessário
        },
      };
      await userController.createUserAccount(createUserReq);

      // OK: salvar a mensagem enviada no histórico de interações
      req.openaiResponse = `Olá ${name}! Tudo bem com você? Eu sou a BRIA, a assistente inteligente da Borogoland e estou aqui para fazer seu processo de boas-vindas. Para começar, que tal me falar sobre você?`;
        console.log("salvou a interação");
        next();

    } else {
        console.log("usuário já existe")
          await chatController.saveChatMessage(userId, msg_body);

        // // OK: Usuário encontrado, analisar interações
        // const analyzeInteractionsReq = {
        //     params: { userId },
        // };
        // await interactionController.analyzeInteractions(
        //     analyzeInteractionsReq,
        //     res
        // );
        next();
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
