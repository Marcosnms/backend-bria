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
            // TODO: 01. INFORMAÇÕES SOBRE O CURSO DE 2024
            case "upgrade_2024":
              // definir userFlow como "upgrade-24"
              req.response = {
                message:
                  "Em breve, você saberá tudo sobre o curso de 2024. Por enquanto, me responda se quer que eu te avise quando estiver disponível.",
                type: "text",
                flow: "02.01",
              };
              next();
              break;

            // TODO: 02. INFORMAÇÕES SOBRE A BOROGOLAND
            case "borogoland_info":
              // Envie uma mensagem de texto sobre a Borogoland
              req.response = {
                message:
                  "Que bom que você quer saber mais sobre a Borogoland! A Borogoland é uma DAO que tem como objetivo ajudar as pessoas a alcançar a sustentabilidade criativa, social e financeira.",
                type: "text",
                flow: "02.02",
              };
              next();
              break;

            // TODO: 03. LINKS ÚTEIS
            case "useful_links":
              // Envie uma lista com links úteis
              req.response = {
                message:
                  `Aqui estão alguns links úteis para você:\n\n` +
                  `- Instagram: https://www.instagram.com/borogoland\n\n` +
                  `- Tiktok: https://www.tiktok.com/@borogoland\n\n` +
                  `- LinkedIn: https://www.linkedin.com/company/borogoland\n\n` +
                  `- Discord: https://discord.gg/B24VqRfXMr\n\n` +
                  `- Youtube: https://www.youtube.com/channel/UCO85c-JdLowXjLjZc8udKGg\n\n` +
                  `- Borogoland: https://www.borogoland.com\n\n` +
                  `- Borogodometro: https://www.borogodometro.com\n\n` +
                  `- Borogoteca: https://www.borogoteca.com\n\n` +
                  `- UnescoSost: https://www.unescosost.com.br`,
                type: "text",
                flow: "02.03",
              };

              next();
              break;

            // TODO: 04. ÁREA DE MEMBROS
            case "members_area":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve você saberá tudo para ser um membro! Olhe pelo lado positivo e veja que sua mensagem foi escolhida corretamente. Me pergunte alguma coisa sobre a Borogoland e eu te responderei.",
                type: "text",
                flow: "02.04",
              };
              next();
              break;

            // TODO: 05. PERFIL DO USUÁRIO
            case "user_profile":

              // definir userFlow como "onboarding" - OK (automático)

              req.response = {
                message:
                  "Ótimo! Vamos configurar seu perfil. Me responda por gentileza algumas perguntas para que eu possa te conhecer melhor e ser mais assertiva nas minhas repostas e comportamento.",
                type: "text",
                flow: "02.05",
              };


              next();
              break;

            // TODO: 06. CENTRAL DE SERVIÇOS
            case "central_servicos":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Procurando um serviço criativo para impulsionar o seu negócio. Confira nossa lista de serviços disponíveis",
                type: "text",
                flow: "02.06",
              };
              next();
              break;

            // TODO: 07. ÁREA DE MEMBROS
            case "wallet":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve, você pode ver seus Borogodós acumulados e como usá-los.",
                type: "text",
                flow: "02.07",
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
