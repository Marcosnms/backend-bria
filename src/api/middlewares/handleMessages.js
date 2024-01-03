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
          "Bem-vindo(a) ao incrível universo da Borogoland, a terra do Borogodó! Eu sou a BRIA, sua assistente virtual cheia de Borogodó, pronta para te guiar nesta jornada repleta de criatividade, conexões e, claro, muitas oportunidades. Aqui é o lugar onde a mágica acontece! ✨",
        type: "text",
        flow: "chegada",
      };
      console.log("novo usuário criado");
      const { exists, userId } =
        await interactionController.findUserByWhatsappNumber(from);

      // Define o fluxo como Onboarding - OK
      await userController.changeActiveFlow(userId, "chegada");
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
        await userController.changeActiveFlow(userId, req.response.flow);
      }

      // busca o Active flow do usuário - OK
      const activeFlow = await userController.getActiveFlow(userId);

      switch (activeFlow) {
        //_________________________________________________ chegada ___________________________________________________ //
        case "chegada":
          req.response = {
            message:
              "Aguade um momento por gentileza, estou realizando minha apresentação... :)\n\nAo terminar você vai ficar por dentro de tudo que eu posso fazer por você!",
            type: "text",
            flow: "vazio",
          };
          next();
          break;

        // _______________________________________________ onboarding _______________________________________________ //
        case "onboarding":
          // qual o score do BasicProfile
          const scoreBasicProfile = await userController.scoreBasicProfile(
            userId
          );
          console.log("scoreBasicProfile:", scoreBasicProfile);
          // tratamento do fluxo básico de PERFIL

          // primeiro acesso do usuário
          if (scoreBasicProfile === 0) {
            // criar threads e agents para o usuário
            console.log("criando threads e agents para o usuário");
            await agentController.createAgents(userId);

            // TODO: CRIAR UMA WALLET PARA O USUÁRIO

            // TODO: TESTAR NOVA LOCATION
            // salva os dados de localiação do usuário
            const location = await getLocation(req.whatsapp.from);
            const { country, state, city } = location;
            console.log("location:", location);
            await userController.saveUserLocation(userId, country, state, city);
          }

          if (scoreBasicProfile < 7) {
            // buscar para ver se tem openFlow - cadastro básico - OK
            const nextFlow = await userController.getOpenFlow(userId);
            console.log("nextFlow:", nextFlow);
            let field = "";
            switch (nextFlow) {
              case null:
                break;

              // TODO: adicionar response_validation com OpenAi. Caso a resposta não seja válida, enviar uma mensagem de erro e pedir para repetir
              case "01.01":
                field = "nickname";
                // função para verificar se a resposta é válida (Nome)
                await userController.saveBasicProfileData(
                  userId,
                  field,
                  msg_body
                );
                console.log("Fluxo 01.01 tratado com sucesso.");
                next();
                break;
              case "01.02":
                field = "gender";
                await userController.saveBasicProfileData(
                  userId,
                  field,
                  msg_body
                );
                console.log("Fluxo 01.02 tratado com sucesso.");
                next();
                break;
              case "01.03":
                field = "age";
                await userController.saveBasicProfileData(
                  userId,
                  field,
                  msg_body
                );
                console.log("Fluxo 01.03 tratado com sucesso.");
                next();
                break;

              case "01.04":
                field = "segment";
                await userController.saveBasicProfileData(
                  userId,
                  field,
                  msg_body
                );
                console.log("Fluxo 01.04 tratado com sucesso.");
                req.response = {
                  message:
                    "Ótimo! 👏🏼👏🏼👏🏼\n\nProntinho! Seu perfil foi criado com sucesso! Agora, escolha uma das opções disponíveis para continuarmos a nossa conversa.\n\nE lembre-se, você pode chamar o menu de funcionalidades a qualquer momento digitando a palavra MENU.",
                  type: "text",
                  flow: "menu",
                };
                await userController.saveOpenFlow(userId, "bria");
                next();
                break;
            }

            const nextQuestion =
              await userController.getNextBasicProfileQuestion(userId);
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

              case "segment":
                req.response = {
                  message:
                    "E em qual área você desenvolve seu Borogodó (ou em qual segmento de mercado você atua) 💼?",
                  type: "text",
                  flow: "onboarding",
                };
                openFlow = "01.04";
                await userController.saveOpenFlow(userId, openFlow);
                next();
                break;
            }
          }
          next();
          break;

        //_________________________________________________ upgrade ___________________________________________________ //
        case "upgrade":
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
          next();
          break;

        //_________________________________________________ profile ___________________________________________________ //
        case "perfil":
          // Verificar se o perfil do usuário está completo.
          // Caso o perfil esteja incompleto, solicitar informações faltantes e atualizar o perfil.
          // Caso o perfil esteja completo, oferecer uma revisão ou atualização de dados.
          // Fornecer opções para visualizar ou editar seções específicas do perfil.
          // Encorajar o usuário a manter seu perfil atualizado para melhores recomendações e conexões.
          next();
          break;

        //_________________________________________________ borogodometro ___________________________________________________ //
        case "borogodometro":
          // Explicar o que é o Borogodômetro e como funciona.
          // Iniciar a avaliação do Borogodô do usuário com perguntas interativas.
          // Analisar as respostas e calcular o nível de Borogodô.
          // Apresentar os resultados e dicas para melhorar ou manter o nível de Borogodô.
          // Oferecer recursos ou atividades para desenvolver habilidades e aumentar o Borogodô.
          next();
          break;

        //_________________________________________________ wallet ___________________________________________________ //
        case "wallet":
          // Verificar o saldo atual na wallet do usuário.
          // Oferecer opções para visualizar transações recentes.
          // Explicar como adicionar ou retirar BRGDs.
          // Informar sobre as recompensas e benefícios de usar a wallet.
          // Auxiliar com dúvidas ou problemas relacionados à wallet.
          next();
          break;

        //_________________________________________________ members ___________________________________________________ //
        case "members":
          // Verificar o status de membro do usuário (ativo/inativo).
          // Caso inativo, explicar os benefícios de ser um membro e como se tornar um.
          // Se ativo, apresentar os recursos exclusivos disponíveis para membros.
          // Fornecer informações sobre eventos, workshops e mentoria exclusivos para membros.
          // Oferecer suporte personalizado e acesso a comunidades de membros.
          next();
          break;

        //_________________________________________________ servicos ___________________________________________________ //
        case "serviços":
          // Listar os serviços disponíveis na plataforma.
          // Oferecer a opção de buscar serviços específicos ou explorar categorias.
          // Auxiliar na contratação de serviços ou na oferta de serviços do usuário.
          // Explicar como avaliar e dar feedback sobre serviços utilizados.
          // Informar sobre novos serviços ou promoções especiais.
          next();
          break;

        //_________________________________________________ mentoria ___________________________________________________ //
        case "wallet":
          // Informar sobre o programa de mentoria disponível e seus benefícios.
          // Auxiliar na escolha da mentoria mais adequada com base no perfil e objetivos do usuário.
          // Agendar sessões de mentoria e lembrar o usuário das datas e horários.
          // Fornecer recursos e materiais de apoio para maximizar os benefícios da mentoria.
          // Coletar feedback após as sessões para melhorar continuamente a experiência.
          next();
          break;

        //_________________________________________________ eventos ___________________________________________________ //
        case "eventos":
          // Listar eventos atuais e próximos relevantes para o usuário.
          // Oferecer opções de filtragem por tipo, data ou tópico de interesse.
          // Facilitar o processo de inscrição em eventos e workshops.
          // Enviar lembretes de eventos e informações importantes (como localização, horário).
          // Coletar feedback pós-evento para melhorar eventos futuros.
          next();
          break;

        //_________________________________________________ lista ___________________________________________________ //
        case "lista":
          // Apresentar a lista de membros da comunidade e suas especialidades.
          // Oferecer opções de busca e filtros para encontrar membros específicos.
          // Facilitar a interação e o networking entre membros da comunidade.
          // Destacar membros com interesses ou habilidades complementares.
          // Encorajar a criação de colaborações e projetos conjuntos.
          next();
          break;

        //_________________________________________________ dao ___________________________________________________ //
        case "borogodao":
          // Explicar o conceito e funcionamento da DAO da Borogoland.
          // Instruir sobre como se tornar um membro da DAO e participar das decisões.
          // Informar sobre votações, propostas e discussões atuais.
          // Auxiliar no processo de votação e na submissão de propostas.
          // Fornecer atualizações regulares sobre o desenvolvimento e mudanças na DAO.
          next();
          break;

        //_________________________________________________ suporte ___________________________________________________ //
        case "suporte":
          // Identificar a natureza do suporte necessário (técnico, geral, informações).
          // Oferecer soluções rápidas para dúvidas ou problemas comuns.
          // Direcionar o usuário para a área ou equipe de suporte apropriada.
          // Fornecer guias, FAQs e recursos úteis para autoajuda.
          // Garantir acompanhamento e satisfação com a resolução do problema.
          next();
          break;

        //_________________________________________________ borogoland ___________________________________________________ //
        case "info":
          // Apresentar a Borogoland e seus objetivos.
          // Explicar como a Borogoland funciona e como participar.
          // Informar sobre os recursos e benefícios disponíveis.
          // Fornecer informações sobre a equipe e os membros da comunidade.
          // Auxiliar com dúvidas ou problemas relacionados à Borogoland.
          next();
          break;
          
        //_________________________________________________ mentoria_____________________________________________________ //
        case "mentoria":
          // Apresentar a mentoria e seus objetivos.
          // Explicar como a mentoria funciona e como participar.
          // Informar sobre os recursos e benefícios disponíveis.
          // Fornecer informações sobre a equipe e os membros da comunidade.
          // Auxiliar com dúvidas ou problemas relacionados à mentoria.
          next();
          break;

        //_________________________________________________ conversa ___________________________________________________ //
        // caso seja qq outra coisa
        case null:
          console.alert("erro no fluxo do usuário");
          next();
          break;
      }
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno do servidor");
  }
};

module.exports = handleMessages;
