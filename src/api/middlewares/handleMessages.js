const chatController = require("../controllers/chatController");
const interactionController = require("../controllers/interactionController");
const userController = require("../controllers/userController");
const getLocation = require("../services/location");
const agentController = require("../controllers/agentController");

const handleMessages = async (req, res, next) => {
  console.log("chegou no handleMessages");
  const { from, name, msg_body } = req.whatsapp;

  try {
    // 00 - VERIFICAR COM QUE ESTAMOS FALANDO
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

      // Cadastra o usuário - OK
      await userController.createUserAccount(newUser);

      // Mensagem de boas vindas ao usuário - OK
      req.response = {
        message:
          `👋 Olá ${name}!\n` +
          "Bem-vindo(a) ao incrível universo da Borogoland! Eu sou a BRIA, sua assistente virtual cheia de Borogodó, pronta para te guiar nesta jornada repleta de criatividade, conexões e, claro, muitas oportunidades. Aqui é o lugar onde a mágica acontece! ✨",
        type: "text",
        flow: "chegada",
      };
      console.log("novo usuário criado");
      const { exists, userId } =
        await interactionController.findUserByWhatsappNumber(from);

      // Define o fluxo como Onboarding - OK
      await userController.changeActiveFlow(userId, "onboarding");
      // Salva a chegada do usuário - OK
      await interactionController.saveUserInteraction(userId, "CHEGADA", true);
      // Salva a mensagem enviada pelo usuário - OK
      await chatController.saveUserMessage(userId, msg_body);

      next();
    }

    // 02 - USUÁRIO EXISTE
    else {
      console.log("usuário já existe");

      // Define quem é o usuário daqui pra frente - OK
      req.userId = userId;

      // Salvar mensagem enviada pelo usuário - OK
      await chatController.saveUserMessage(userId, msg_body);
      console.log("mensagem salva no chat");

      // verifica se o usário solicitou o menu - OK
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

      // Verifica se a mensagem é interativa, caso positivo, muda o ActiveFlow - OK
      if (req.whatsapp.msg_type === "interactive") {
         await userController.changeActiveFlow(
          userId,
          req.response.flow
        );
      }

      // busca o Active flow do usuário - OK
      const activeFlow = await userController.getActiveFlow(userId);

      // _______________________________________________ onboarding _______________________________________________ //

      if (activeFlow === "onboarding") {
        // buscar para ver se tem openFlow - cadastro básico - OK
        const openFlow = await userController.getOpenFlow(userId);
        console.log("openFlow:", openFlow);
        let field = "";
        switch (openFlow) {
          case null:
            break;
          case "01.01":
            field = "nickname";
            // função para verificar se a resposta é válida (Nome)
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
            req.response = {
              message:
                "Ótimo! 👏🏼👏🏼👏🏼\n\nProntinho! Seu perfil foi criado com sucesso! Agora, escolha uma das opções disponíveis para continuarmos a nossa conversa.\n\nE lembre-se, você pode chamar o menu de funcionalidades a qualquer momento digitando a palavra MENU.",
              type: "text",
              flow: "menu",
            };
            await userController.saveOpenFlow(userId, null);
            next();
            break;
        }
        // qual o score do BasicProfile
        const scoreBasicProfile = await userController.scoreBasicProfile(
          userId
        );
        console.log("scoreBasicProfile:", scoreBasicProfile);
        // tratamento do fluxo básico de PERFIL
        // TODO: adicionar response_validation com OpenAi. Caso a resposta não seja válida, enviar uma mensagem de erro e pedir para repetir

        // primeiro acesso do usuário
        if (scoreBasicProfile === 0) {
          // criar threads e agents para o usuário
          console.log("criando threads e agents para o usuário");
          await agentController.createAgents(userId);


          // TODO: CRIAR UMA WALLET PARA O USUÁRIO
          
          // salva os dados de localiação do usuário
          const location = await getLocation();
          const { country, region_code, city } = location;
          console.log("location:", location);
          await userController.saveUserLocation(
            userId,
            country,
            region_code,
            city
          );
        }

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
                message: `🤓 Uau... que nome bonito ${msg_body}! Um grande prazer em te conhecer.\n\nE qual o pronome de tratamento que você gostaria que eu utilize em nossas conversas?`,
                type: "text",
                flow: "gender",
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
                  "Ótimo, prometo não contar pra ninguem!! Já estamos na metade da nossa entrevista! 🎉\n\nE qual seu grau de escolaridade? 📚",
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
                  "Bom saber! E qual é o seu Borogodó (ou, em outras palavras, o que te faz especial?) ✨?",
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
                  "E em qual área você desenvolve este Borogodó (ou em qual segmento de mercado você atua) 💼?",
                type: "text",
                flow: "onboarding",
              };
              openFlow = "01.06";
              await userController.saveOpenFlow(userId, openFlow);
              next();
              break;
          }

          // TODO: se perfil tiver completo, perguntar qual campo deseja alterar

          // se for > 8, envia uma pergunta do fluxo avançado
        }

        next();
      }

      //_________________________________________________ upgrade ___________________________________________________ //
      else if (activeFlow === "upgrade") {
        //01. verificar se o usuário tem acesso ao curso (é membro ou tem o curso liberado)
        //01.01 - caso negativo, fazer uma breve explicação de como funciona e listar para o usuário os cursos disponíveis. Verificar interesse e realizar oferta.
        //01.02 - caso positivo, verificar se existe algum curso em andamento
        //01.02.01 - caso não tenha nenhum curso em andamento, listar os cursos disponíveis para o usuário
        //01.02.02 - caso tenha algum curso em andamento,  perguntar se ele deseja continuar o curso em andamento ou iniciar um novo curso
        //01.03 - verificar qual o status do andamento do curso
        //01.03.01 - enviar a mensagem de boas vindas ao curso e enviar a primeira aula
        //01.03.02 - enviar as proximas aulas e mapear o progresso do usuário
        //01.03.03 - enviar a mensagem de conclusão do curso e enviar o certificado
        //01.04 - verificar se o usuário deseja continuar no curso ou se deseja fazer outro curso
        const openFlow = await userController.getOpenFlow(userId);
        console.log("openFlow:", openFlow);
        let field = "";
        switch (openFlow) {
          case null:
            break;
          case "01.01": //
            console.log("Fluxo 01.01 tratado com sucesso.");
            break;
          case "01.02":
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
            req.response = {
              message:
                "Ótimo! 👏🏼👏🏼👏🏼\n\nProntinho! Seu perfil foi criado com sucesso! Agora, escolha uma das opções disponíveis para continuarmos a nossa conversa.\n\nE lembre-se, você pode chamar o menu de funcionalidades a qualquer momento digitando a palavra MENU.",
              type: "text",
              flow: "menu",
            };
            await userController.saveOpenFlow(userId, null);
            next();
            break;
        }

        next();
      }

      //_________________________________________________ members ___________________________________________________ //
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
          next();
        }
      }

      //_________________________________________________ conversa ___________________________________________________ //
      // caso seja qq outra coisa
      else {
        next();
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
