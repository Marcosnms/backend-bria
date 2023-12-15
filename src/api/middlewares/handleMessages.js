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

    if (!exists) {
      // 01 - USUÁRIO NAO EXISTE
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
        message: `Olá ${name}! Como vai? Eu sou a BRIA, sua assistente virtual na Borogoland. Estou aqui para garantir que sua jornada seja incrível e produtiva. Vamos iniciar agora o seu onboarding para que você possa tirar o máximo proveito dos recursos e atividades tenho a te oferecer. A seguir, selecione a opção para configurar seu perfil.`,
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
          // enviar uma resposta
          // enviar a próxima pergunta (ativo)
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
          field = "country";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.06 tratado com sucesso.");
          break;
        case "01.07":
          field = "state";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.07 tratado com sucesso.");
          break;
        case "01.08":
          field = "city";
          await userController.saveBasicProfileData(userId, field, msg_body);
          console.log("Fluxo 01.08 tratado com sucesso.");
          req.response = {
            message: "Ótimo! Seu perfil foi criado com sucesso! Agora, escolha uma das opções disponívels para continuarmos a nossa conversa.",
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
        if (scoreBasicProfile < 8) {
          const nextQuestion = await userController.getNextBasicProfileQuestion(
            userId
          );
          console.log("nextQuestion:", nextQuestion);
          let openFlow = "";
          switch (nextQuestion) {
            case "nickname":
              req.response = {
                message: "Ótimo! Vamos começar. Uma grande alegria em ter você aqui. Como você gostaria que eu te chamasse?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.01";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "gender":
              req.response = {
                message: `Uau... que nome bonito ${msg_body}! Um grande prazer em te conhecer. E qual o pronome de tratamento que você gostaria que eu utilize em nossas conversas (Masculino, Feminino, Outros)?`,
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.02";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "age":
              req.response = {
                message: "Entendi, combinado! Quantas voltas ao redor do sol você já completou (ou seja, qual é a sua idade)? Pode deixar que fica entre a gente :)",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.03";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "educationLevel":
              req.response = {
                message: "E qual foi a última aventura que você teve na jornada do conhecimento? (ou seja, até onde você estudou?)",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.04";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "profession":
              req.response = {
                message: "E qual é o superpoder profissional que você usa para conquistar o mundo com seu Borogodó (ou, em outras palavras, qual é a sua profissão atual)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.05";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "country":
              req.response = {
                message: "De qual canto incrível do nosso planeta Terra você está nos enviando sinais (em que país você reside)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.06";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "state":
              req.response = {
                message: "Em qual pedaço deste país você está explorando a vida (em que estado você mora)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.07";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;

            case "city":
              req.response = {
                message: "E em qual cidade você está desbravando o mundo (em que cidade você mora)?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.08";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;
          }

          // se o perfil tiver completo, perguntar qual campo deseja alterar
          // se for < 8, envia uma pergunta do fluxo básico
          // se for === 8, envia uma pergunta do fluxo avançado
          // se for > 8, envia uma pergunta do fluxo avançado
        }

        // caso as infos básicas estiverem preenchidas, envia uma mensagem de boas vindas e o menu principal
        // caso as o usuário queira adicionar mais informações, realizar lista de perguntas avançadas.

        next();
      } else {
        next();
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
