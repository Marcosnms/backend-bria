const interactionController = require("../controllers/interactionController");
const userController = require("../controllers/userController");

const handleMessages = async (req, res, next) => {
  console.log("chegou no handleMessages");
  const { from, name } = req.whatsapp;
  try {
    // Verificar se usuário existe e buscar o id dele
    const { exists, userId } =
      await interactionController.findUserByWhatsappNumber(from);

    if (!exists) {
      // Usuário não encontrado, criar conta
      const createUserReq = {
        body: {
          name: name, // Supondo que 'name' esteja disponível em req.whatsapp
          whatsappNumber: from,
          privateKey: "Borogoland@954:)", // Substitua com o valor real conforme necessário
        },
      };
      await userController.createUserAccount(createUserReq, res);

      next();
    } else {
      // Usuário existe, userID disponível para uso
      console.log("usuario existe:", userId);
      next();
      // 1. verificar se é uma nova conversa ou uma conversa ativa
      // 2. se for uma nova conversa, enviar opções disponíveis ao usuário
      // 3. se for uma conversa ativa, analisar histórico e responder de acordo com os processos de comunicação
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
