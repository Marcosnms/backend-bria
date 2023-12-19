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

        // 02. CASO A MENSAGEM SEJA UMA RESPOSTA A UMA MENSAGEM INTERATIVA
      } else if (msg_type === "interactive") {
        console.log("mensagem interativa");
        const messageData = req.body.entry[0].changes[0].value.messages[0];

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

          // opções de resposta disponíveis
          switch (selectedOptionId) {
            // 01. ONBOARDING
            case "onboarding":
              // definir userFlow como "onboarding" - OK (automático)
              req.response = {
                message:
                  "Ótimo! Vamos configurar seu perfil. Me responda por gentileza algumas perguntas para que eu possa te conhecer melhor e ser mais assertiva nas minhas repostas e comportamento.",
                type: "text",
                flow: "onboarding",
              };
              next();
              break;

            // TODO: 02. INFORMAÇÕES SOBRE O CURSO DE 2024
            case "upgrade":
              // definir userFlow como "upgrade-24"
              req.response = {
                message:
                "Os melhores vídeos selecionados para você direto da Borogoteca.\n\n" +
                "Equanto a integração não vem, acesse o link: https://transcriativa.cademi.com.br/ e saiba mais!",                type: "text",
                flow: "upgrade",
              };
              next();
              break;

            // TODO: 03. INFORMAÇÕES SOBRE A BOROGOLAND
            case "info":
              // Envie uma mensagem de texto sobre a Borogoland
              req.response = {
                message:
                  "Que bom que você quer saber mais sobre a Borogoland!\n\nA Borogoland é a terra virtual do Borogodó que tem como objetivo ajudar as pessoas a alcançar a sustentabilidade criativa, social e financeira.\n\nEm breve, você vai receber notícias de como participar.",
                type: "text",
                flow: "info",
              };
              next();
              break;

            // TODO: 04. LINKS ÚTEIS
            case "links":
              // Envie uma lista com links úteis
              req.response = {
                message:
                  `Aqui estão alguns links úteis para você começar a sua Jornada:\n\n` +
                  `- Instagram: https://www.instagram.com/borogoland\n\n` +
                  `- Tiktok: https://www.tiktok.com/@borogoland\n\n` +
                  `- LinkedIn: https://www.linkedin.com/company/borogoland\n\n` +
                  `- Discord: https://discord.gg/B24VqRfXMr\n\n` +
                  `- Youtube: https://www.youtube.com/channel/UCO85c-JdLowXjLjZc8udKGg\n\n` +
                  `- Borogoland: https://www.borogoland.com\n\n` +
                  `- Borogodometro: https://www.borogodometro.com\n\n` +
                  `- Borogoteca: https://www.borogoteca.com\n\n` +
                  `- UnescoSost: https://www.unescosost.com.br\n\n` +
                  '- Transcriativa: https://www.transcriativa.com.br',
                type: "text",
                flow: "links",
              };

              next();
              break;

            // TODO: 05. ÁREA DE MEMBROS
            case "members":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve você saberá tudo para ser um membro! Caso queira ser avisado sobre a disponibilidade e benefícios de ser um membro, escreva:\n\neu quero",
                type: "text",
                flow: "members",
              };
              next();
              break;

            // TODO: 06. PERFIL DO USUÁRIO
            case "profile":
              req.response = {
                message:
                  "Em breve, vamos melhorar seu perfil. Por enquanto, me pergunte alguma coisa sobre você e eu te responderei. ",
                type: "text",
                flow: "profile",
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
                flow: "servicos",
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
                  "Em breve vai ter um Borogodometro aqui também!" ,
                type: "text",
                flow: "borogodometro",
              };
              next();
              break;
          }
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
