const { Console } = require("console");
const https = require("https");

const whatsappMiddleware = (req, res, next) => {
  console.log("chegou no whatsappMiddleware");

  // console.log("req.body:", JSON.stringify(req.body, null, 2));

  //__________________________parte receptora________________________//
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const whatsappNumber =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
      const msg_type = req.body.entry[0].changes[0].value.messages[0].type; // extract the message type from the webhook payload

      //__________________________configuração para respostas de texto________________________//
      // 01. CASO A MENSAGEM SEJA DE TEXTO
      if (msg_type === "text") {
        const msg_body =
          req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        // Anexa as informações extraídas à solicitação para uso posterior
        req.whatsapp = {
          whatsappNumber,
          from,
          msg_body,
          name,
          msg_type,
        };
        console.log("texto:", req.whatsapp);
        next(); // envia para a próxima etapa - handleMessages

        //______________________ configuração para respostas interativas _______________________//
      }
      // 02. CASO A MENSAGEM SEJA UMA RESPOSTA A UMA MENSAGEM INTERATIVA
      else if (msg_type === "interactive") {
        console.log("mensagem interativa");
        const messageData = req.body.entry[0].changes[0].value.messages[0];

        // 02.01 - caso seja a resposta de uma lista
        if (messageData.interactive.type === "list_reply") {
          const selectedOptionId = messageData.interactive.list_reply.id;

          // Anexa as informações extraídas à solicitação para uso posterior
          req.whatsapp = {
            whatsappNumber,
            from,
            msg_body: "resposta interativa",
            name,
            msg_type,
          };

          // opções de lista disponíveis
          switch (selectedOptionId) {
            // 01. ONBOARDING - OK
            case "onboarding":
              req.response = {
                message:
                  "Ótimo! Vamos configurar seu perfil. Me responda por gentileza algumas perguntas para que eu possa te conhecer melhor e ser mais assertiva nas minhas repostas e comportamento.",
                type: "text",
                flow: "onboarding",
              };
              next();
              break;

            // TODO: 02. INFORMAÇÕES SOBRE A TRILHA DE UPGRADE
            case "upgrade":
              req.response = {
                message:
                  "Fique atualizado com o conteúdo estruturado por nossos especialistas.\n\n" +
                  "Conheça as trilhas de conhecimento interativas e gamificadas que vão te ajudar a alcançar a sustentabilidade criativa, social e financeira.\n\n" +
                  "As trilhas atuais disponíveis são:\n\n" +
                  "🧠 Trilha da Inteligência Artificial Generativa\n" +
                  "🌐 Trilha da Web3\n" +
                  "🌌  Trilha do Metaverso\n\n" +
                  "Qual trilha você quer conhecer?",
                type: "text",
                flow: "upgrade",
              };
              next();
              break;

            // TODO: 03. INFORMAÇÕES SOBRE A BOROGOLAND
            case "info":
              // Envie uma mensagem de texto sobre a Borogoland
              req.response = {
                message:
                  "Que bom que você quer saber mais sobre a Borogoland!\n\nA Borogoland é a terra virtual do Borogodó que tem como objetivo ajudar as pessoas a alcançar a sustentabilidade criativa, social e financeira.\n\nQual tipo de dúvida você tem sobre a Borogoland ou como posso te ajudar?",
                type: "text",
                flow: "info",
              };
              next();
              break;

            // TODO: 04. ÁREA DE MEMBROS
            case "members":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Ótimo! Vou te mostrar as opções de serviços que temos disponíveis para os nossos membros!",
                type: "text",
                flow: "members",
              };
              next();
              break;

            // TODO: 04.01 ÁREA DE MEMBROS - EVENTOS
            case "eventos":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve novos eventos serão divulgados. Caso queira ser avisado sobre a disponibilidade e benefícios de ser um membro, escreva:\n\neu quero",
                type: "text",
                flow: "eventos",
              };
              next();
              break;

            // TODO: 04.02 ÁREA DE MEMBROS - MENTORIA
            case "mentoria":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve novas mentorias serão divulgadas. Caso queira ser avisado sobre a disponibilidade e benefícios de ser um membro, escreva:\n\neu quero",
                type: "text",
                flow: "mentoria",
              };
              next();
              break;

            // TODO: 04.03 ÁREA DE MEMBROS - LISTA DE MEMBROS
            case "lista_membros":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve novos membros serão divulgados. Caso queira ser avisado sobre a disponibilidade e benefícios de ser um membro, escreva:\n\neu quero",
                type: "text",
                flow: "lista",
              };
              next();
              break;

            // TODO: 04.04 ÁREA DE MEMBROS - SUPORTE
            case "suporte":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Fale comigo! Como posso te ajudar?",
                type: "text",
                flow: "suporte",
              };
              next();
              break;

            // TODO: 05. DAO
            case "borogodao":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve você saberá tudo para ser um membro! Caso queira ser avisado sobre a disponibilidade e benefícios de ser um membro, escreva:\n\neu quero",
                type: "text",
                flow: "borogodao",
              };
              next();
              break;

            // TODO: 06. PERFIL DO USUÁRIO
            case "profile":
              req.response = {
                message:
                  "Em breve, vamos melhorar seu perfil. Por enquanto, me pergunte alguma coisa e eu te responderei. ",
                type: "text",
                flow: "perfil",
              };

              next();
              break;

            // TODO: 07. CENTRAL DE SERVIÇOS
            case "servicos":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve, oportunidades para você ganhar dinheiro com seu Borogodó!",
                type: "text",
                flow: "serviços",
              };
              next();
              break;

            // TODO: 08. CARTEIRA
            case "wallet":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve, você poderá ver seus BRGDs acumulados e como usá-los na Borogoland. Tá vindo coisa muito legal por aí! 💫",
                type: "text",
                flow: "wallet",
              };
              next();
              break;

            // TODO: 09. BOROGODOMETRO
            case "borogodometro":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Descubra o nível do seu Borogodó!\n\n" +
                  "Acesse o link: https://www.borogodometro.com.br e faça seu teste agora mesmo. É grátis, facil e rápido!\n\n" +
                  "Em breve vai ter um Borogodometro aqui também!",
                type: "text",
                flow: "borogodometro",
              };
              next();
              break;
          }
        }

        // 02.02 - caso seja a resposta de um botão
        else if (messageData.interactive.type === "button_reply") {
          const selectedOptionId = messageData.interactive.button_reply.id;
          // Anexa as informações extraídas à solicitação para uso posterior
          req.whatsapp = {
            whatsappNumber,
            from,
            msg_body: selectedOptionId,
            name,
            msg_type: "text",
          };
          next();
        }
      }
      // 03. CASO OUTRA MENSAGEM SEJA ENVIADA
      else {
        // TODO: ajustar a resposta para dizer que não aceita esse tipo de mensagem no momento
        console.log(
          "Aqui depois vai a rota para confirmações de status das mensagens"
        );
      }
    }
  }
};
// ______________________funções do whatsapp________________________//
// _________________________________________________________________//

// 01. FUNÇÃO PARA ENVIAR UMA MENSAGEM DE TEXTO - 0K
whatsappMiddleware.sendText = (
  whatsappNumber,
  whatsapp_token,
  to,
  reply_message,
  resp
) => {
  // console.log("dados enviados sendreply:", whatsappNumber, whatsapp_token, to, reply_message, resp)
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: to,
    text: { body: reply_message },
  });

  const path =
    "/v18.0/" + whatsappNumber + "/messages?access_token=" + whatsapp_token;
  const options = {
    host: "graph.facebook.com",
    path: path,
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const callback = (response) => {
    let str = "";
    response.on("data", (chunk) => {
      str += chunk;
    });
    response.on("end", () => {});
  };
  const req = https.request(options, callback);
  req.on("error", (e) => {});
  req.write(data);
  req.end();
  console.log("Enviou:", data);
  resp.sendStatus(200);
};

// 02. FUNÇÃO PARA RESPONDER COM UMA IMAGEM
// TODO: ajustar a função para enviar uma imagem. Por enquanto só responde com um texto específico
whatsappMiddleware.sendImage = (
  whatsappNumber,
  whatsapp_token,
  to,
  reply_message,
  resp
) => {
  // console.log("dados enviados sendreply:", whatsappNumber, whatsapp_token, to, reply_message, resp)
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: to,
    text: { body: reply_message },
  });

  const path =
    "/v18.0/" + whatsappNumber + "/messages?access_token=" + whatsapp_token;
  const options = {
    host: "graph.facebook.com",
    path: path,
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const callback = (response) => {
    let str = "";
    response.on("data", (chunk) => {
      str += chunk;
    });
    response.on("end", () => {});
  };
  const req = https.request(options, callback);
  req.on("error", (e) => {});
  req.write(data);
  req.end();
  console.log("Enviou");
  resp.sendStatus(200);
};

module.exports = whatsappMiddleware;
