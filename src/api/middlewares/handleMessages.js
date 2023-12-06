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
      req.response = {
        message: `Olá ${name}! Tudo bem com você? Eu sou a BRIA, a assistente inteligente da Borogoland e estou aqui para fazer seu processo de boas-vindas. Para começar, que tal me falar sobre você?`,
        type: "text",
        flow: "01",
      };
      console.log("novo usuário criado");
      next();
    } else {
      console.log("usuário já existe");
      await chatController.saveUserMessage(userId, msg_body);
      console.log("mensagem salva no chat");
      // req.user = { userId };

      // TODO: verificar o tipo de informação
      

      // // em caso de texto, verificar o contexto e dependendo enviar para a OpenAI
      // // em caso de imagem, enviar para o Google Vision (por enquanto não temos essa funcionalidade, enviar reposta padrão)
      // // em caso de audio, enviar para o Google Speech-to-Text (por enquanto não temos essa funcionalidade, enviar reposta padrão)
      // // em caso de documento, enviar para o Google Document AI (por enquanto não temos essa funcionalidade, enviar reposta padrão)
      // // em caso de resposta interativa, verificar o que fazer com a resposta

      // TODO: verificar se a mensagem é uma resposta a uma pergunta

      // TODO: salvar a mensagem no histórico de interações: CONVERSA

      // // OK: Usuário encontrado, analisar interações
      // const analyzeInteractionsReq = {
      //     params: { userId },
      // };
      // await interactionController.analyzeInteractions(
      //     analyzeInteractionsReq,
      //     res
      // );
      req.response = {
        message: "teste",
        type: "text",
        flow: "02",
      };
      next();
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
