const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");
const userController = require("../controllers/userController");

const handleMessages = async (req, res, next) => {
  console.log("chegou no handleMessages");
  const { from, name, msg_body } = req.whatsapp;

  try {
    // FLOW 00 - VERIFICAR COM QUE ESTAMOS FALANDO
    // Verificar se usuário existe e buscar o id dele - OK
    const { exists, userId } =
      await interactionController.findUserByWhatsappNumber(from);

    if (!exists) {
      // FLOW 01 - USUÁRIO NAO EXISTE
      // Usuário não encontrado, criar conta - OK
      console.log("usuário não existe");
      const newUser = {
        body: {
          name: name,
          whatsappNumber: from,
          privateKey:
            "adskflja08q3w47r5wjsd098upolkfasdf-98aiasçdasdfasdfasdf2q133241g4~]=8906klfasd", // Substitua com o valor real conforme necessário
        },
      };

      // INTERACTION 01 - Cadastra o usuário - OK
      await userController.createUserAccount(newUser);

      // OK: salvar a mensagem enviada no histórico de interações
      req.response = {
        message: `Olá ${name}! Como vai? Eu sou a BRIA, sua assistente virtual na Borogoland. Estou aqui para garantir que sua jornada seja incrível e produtiva. Vamos iniciar agora o seu onboarding para que você possa tirar o máximo proveito dos recursos e atividades tenho a te oferecer. A seguir, escolha uma das opções ou me pergunte qualquer coisa.`,
        type: "text",
        flow: "01",
      };
      console.log("novo usuário criado");
      const { exists, userId } =
        await interactionController.findUserByWhatsappNumber(from);

      // INTERACTION 01.01 - Salvar a chegada do usuário - OK
      await interactionController.saveUserInteraction(userId, "CHEGADA", true);
      // INTERACTION 01.02 - Salvar a mensagem enviada pelo usuário - OK
      await chatController.saveUserMessage(userId, msg_body);

      next();
    } else {
      // FLOW 02 - USUÁRIO EXISTE

      console.log("usuário já existe");
      // Define quem é o usuário daqui pra frente - OK
      req.user.id = { userId };

      // INTERACTION 02.01 - Salvar mensagem enviada pelo usuário - OK
      await chatController.saveUserMessage(userId, msg_body);
      console.log("mensagem salva no chat");

      // INTERACTION 02.02 - TRATAR A MENSAGEM ENVIADA PELO USUÁRIO

      const activeChat = await interactionController.analyzeInteractions(
        userId
      );

      // FLOW 02.01 - É UMA CONVERSA EM ANDAMENTO - Tem histórico de conversa nas últimas 24h
      if (activeChat === "ativa") {

        // 1. o usuário tem perfil definido?
        

        // TODO: buscar entender o contexto da conversa

        // 2. o usuário está no curso?
        // 3. o usuário é um membro?
        // 4. qual o tom e o sentimento por trás das mensagens do usuário

        // TODO: definir os objetivos de conversão

        console.log("conversa ativa");

        // FLOW 02.02.01 - É UMA PERGUNTA

        // FLOW  02.02.02 - É UMA RESPOSTA
      } else {
        // FLOW 02.02 - É UMA CONVERSA NOVA
        // Não tem histórico de conversa nas últimas 24h
        // Caso negativo, enviar uma saudação e entender em qual fluxo de encaixa a pergunta
        // await interactionController.saveUserInteraction(
        //   userId,
        //   "NOVA_CONVERSA",
        //   true,
        // );
      }

      next();
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
