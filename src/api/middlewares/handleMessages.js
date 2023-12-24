const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");
const userController = require("../controllers/userController");

const handleMessages = async (req, res, next) => {
  console.log("chegou no handleMessages");
  const { from, name, msg_body } = req.whatsapp;

  try {
    // 00 - VERIFICAR COM QUE ESTAMOS FALANDO
    // Verificar se usuário existe e buscar o id dele - OK
    const { exists, userId } =
      await interactionController.findUserByWhatsappNumber(from);

    // 01 - USUÁRIO NAO EXISTE
    if (!exists) {
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
        message: `👋 Olá ${name}!\n`+
        "Bem-vindo(a) ao incrível universo da Borogoland! Eu sou a BRIA, sua assistente virtual cheia de Borogodó, pronta para te guiar nesta jornada repleta de criatividade, conexões e, claro, muitas oportunidades. Aqui é o lugar onde a mágica acontece! ✨",
        type: "text",
        flow: "chegada",
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
      // 02 - USUÁRIO EXISTE

      console.log("usuário já existe");
      // Define quem é o usuário daqui pra frente - OK
      req.userId = userId;

      // Salvar mensagem enviada pelo usuário - OK
      await chatController.saveUserMessage(userId, msg_body);
      console.log("mensagem salva no chat");

      // verifica se o usário solicitou o menu
      if (req.whatsapp.msg_body.toLowerCase() === "menu".toLowerCase()) {
        console.log("usuário solicitou o menu");
        req.response = {
          message:
            "Entendido! Vou te enviar o menu de funcionalidades disponíveis agora mesmo! 😎",
          type: "text",
          flow: "menu",
        };
        next();
      }

      // Verifica se a mensagem é interativa - OK
      if (req.whatsapp.msg_type === "interactive") {
        await userController.changeActiveFlow(userId, req.response.flow);
      }

      // buscar para ver se tem openFlow
      const openFlow = await userController.getOpenFlow(userId);
      console.log("openFlow:", openFlow);
      let field = "";
      switch (openFlow) {
        case null:
          break;
        case "01.01":
          field = "nickname";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.01 tratado com sucesso.");
          break;
        case "01.02":
          field = "gender";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.02 tratado com sucesso.");
          break;
        case "01.03":
          field = "age";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.03 tratado com sucesso.");
          break;
        case "01.04":
          field = "educationLevel";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.04 tratado com sucesso.");
          break;
        case "01.05":
          field = "profession";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.05 tratado com sucesso.");
          break;
        case "01.06":
          field = "segment";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.06 tratado com sucesso.");
          break;
        case "01.07":
          field = "country";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.07 tratado com sucesso.");
          break;
        case "01.08":
          field = "state";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.08 tratado com sucesso.");
          break;
        case "01.09":
          field = "city";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.09 tratado com sucesso.");
          req.response = {
            message: "Ótimo! 👏🏼👏🏼👏🏼\n\nSeu perfil foi criado com sucesso! Agora, escolha uma das opções disponívels para continuarmos a nossa conversa.\n\nVocê pode chamar o menu de funcionalidades a qualquer momento digitando a palavra MENU.",
            type: "text",
            flow: "menu",
          };
          await userController.saveOpenFlow(userId, null);
          next();
          break;
      }

      // verifica o user activeflow
      const activeFlow = await interactionController.getActiveFlow(userId);
      req.activeFlow = activeFlow;
      console.log("activeFlow:", activeFlow);

      // se for === onboarding
      if (activeFlow === "onboarding") {
        // qual o score do BasicProfile
        const scoreBasicProfile = await userController.scoreBasicProfile(
          userId
        );
        console.log("scoreBasicProfile:", scoreBasicProfile);
        // tratamento do fluxo básico de PERFIL
        // TODO: adicionar response_validation com OpenAi. Caso a resposta não seja válida, enviar uma mensagem de erro e pedir para repetir
        if (scoreBasicProfile < 9) {
          const nextQuestion = await userController.getNextBasicProfileQuestion(
            userId
          );
          console.log("nextQuestion:", nextQuestion);
          let openFlow = "";
          switch (nextQuestion) {
            case "nickname":
              req.response = {
                message:
                  "Ótimo! Uma grande alegria em ter você aqui.🥳\n\nVamos configurar o seu perfil. Prometo que vai ser rapidinho. Escreva como você gostaria que eu te chamasse?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.01";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "gender":
              req.response = {
                message: `🤓 Uau... que nome bonito ${msg_body}! Um grande prazer em te conhecer.\n\nE qual o pronome de tratamento que você gostaria que eu utilize em nossas conversas (Masculino, Feminino, Outros)?`,
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.02";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "age":
              req.response = {
                message:
                  "Entendi, combinado! E qual é a sua idade?\n\nUtilizo esta informação para fornecer conteúdos adequados. Pode deixar que fica entre a gente.😉",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.03";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "educationLevel":
              req.response = {
                message:
                  "Ótimo, prometo não contar pra ninguem!! Já estamos na metade da nossa entrevista! 🎉\n\nE qual foi a última aventura que você teve na jornada do conhecimento? (ou seja, até onde você estudou?)📚",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.04";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "profession":
              req.response = {
                message:
                  "Bom saber! E qual é o seu Borogodó (ou, em outras palavras, o que você faz atualmente) ✨?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.05";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "segment":
              req.response = {
                message:
                  "E em qual segmento você desenvolve este Borogodó (ou seja, em qual área de mercado você atua) 💼?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.06";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "country":
              req.response = {
                message:
                  "Estamos quase acabando...\n\nEm qual canto do planeta 🌏 você está (em que país você mora)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.07";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "state":
              req.response = {
                message:
                  "E agora me fala, em qual pedaço deste país você está explorando a vida (em que estado você mora)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.08";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "city":
              req.response = {
                message:
                  "E lá vai a última: e em qual cidade você está?\n\nVou utilizar futuramente esta informação para te conectar com pessoas e oportunidades próximas a você, mas você pode alterar depois se quiser.",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.09";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;
          }

          // TODO: se perfil tiver completo, perguntar qual campo deseja alterar

          // se for > 8, envia uma pergunta do fluxo avançado
        }

        // caso as infos básicas estiverem preenchidas, envia uma mensagem de boas vindas e o menu principal
        // caso as o usuário queira adicionar mais informações, realizar lista de perguntas avançadas.

        next();
      }
      // se for === members
      else if (activeFlow === "members") {
        if (req.whatsapp.msg_body.toLowerCase() === "eu quero".toLowerCase()) {
          console.log("usuário solicitou o menu");
          req.response = {
            message:
              "Combinado. Assim que tiver novidades vou te avisar. 😉\n\n" +
              "Vou chamar o menu de funcionalidades novamente para você, ok?",
            type: "text",
            flow: "menu",
          };
          next();
        } else {
          await userController.changeActiveFlow(userId, "conversa");
          next();
        }
      }
      // se for === compliance
      else if (activeFlow === "compliance") {
        // define o campo compliance como false
        await userController.saveCompliance(userId, false);
        next();
      }
      // caso seja qq outra coisa
      else {
        await userController.changeActiveFlow(userId, "conversa");
        next();
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
