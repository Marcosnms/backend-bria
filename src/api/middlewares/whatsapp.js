const { Console } = require("console");
const https = require("https");

const whatsappMiddleware = (req, res, next) => {
  console.log("chegou no whatsappMiddleware");

  console.log("req.body:", JSON.stringify(req.body, null, 2));

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
        next();

        // 02. CASO A MENSAGEM SEJA UMA RESPOTA A UMA MENSAGEM INTERATIVA
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

          // OPÇÕES DISPONÍVEIS
          switch (selectedOptionId) {
            // 01. INFORMAÇÕES SOBRE A BOROGOLAND
            case "borogoland_info":
              // Envie uma mensagem de texto sobre a Borogoland
              req.response = {
                message:
                  "Que bom que você quer saber mais sobre a Borogoland! A Borogoland é uma DAO que tem como objetivo ajudar as pessoas a alcançar a sustentabilidade criativa, social e financeira.",
                type: "text",
                flow: "02",
              };
              next();
              break;

            // 02. LINKS ÚTEIS
            case "useful_links":
              // Envie uma lista com links úteis
              req.response = {
                message:
                  "Vamos ter links bem legais aqui, mas por equanto ainda não. Pergunte-me outra coisa sobre a Borogoland e eu te responderei.",
                type: "text",
                flow: "02",
              };

              next();
              break;

            // 03. ÁREA DE MEMBROS
            case "members_area":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Em breve você saberá tudo para ser um membro! Olhe pelo lado positivo e veja que sua mensagem foi escolhida corretamente. Me pergunte alguma coisa sobre a Borogoland e eu te responderei.",
                type: "text",
                flow: "02",
              };
              next();
              break;

            // 03. ÁREA DE MEMBROS
            case "user_profile":
              // Envie uma imagem representando a área de membros
              req.response = {
                message:
                  "Vamos nos conhecer melhor para que eu possa te ajudar? Conte-me um pouco sobre você, sua região, interesses e habilidades. Isso me ajudará a oferecer atividades e oportunidades relevantes para você.",
                type: "text",
                flow: "02",
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

// 01. FUNÇÃO PARA ENVIAR UMA MENSAGEM DE TEXTO - 0K

// Função auxiliar para enviar resposta via WhatsApp
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

// 02. FUNÇÃO PARA ENVIAR A LISTA DE OPÇÕES - OK
whatsappMiddleware.sendListMessage = (whatsappNumber, whatsapp_token, to) => {
  return new Promise((resolve, reject) => {
    const listOptions = {
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "Estou aqui para te ajudar. Para continuar, escolha umas da opções:",
        },
        action: {
          button: "Selecione a Opção",
          sections: [
            {
              title: "Menu Principal",
              rows: [
                {
                  id: "borogoland_info",
                  title: "Sobre a Borogoland",
                },
                {
                  id: "useful_links",
                  title: "Links Úteis",
                },
                {
                  id: "members_area",
                  title: "Área de Membros",
                },
                {
                  id: "user_profile",
                  title: "Configurar Perfil",
                },
              ],
            },
          ],
        },
      },
    };

    const data = JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      message: listOptions,
    });

    const path = `/v18.0/${whatsappNumber}/messages?access_token=${whatsapp_token}`;
    const options = {
      host: "graph.facebook.com",
      path: path,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const req = https.request(options, (response) => {
      let str = "";
      response.on("data", (chunk) => {
        str += chunk;
      });
      response.on("end", () => {
        resolve(str); // Resolve a promessa quando a mensagem é enviada
      });
    });

    req.on("error", (e) => {
      reject(e); // Rejeita a promessa em caso de erro
    });

    req.write(data);
    console.log("Enviou uma lista de opções");
    req.end();
  });
};

// 03. FUNÇÃO PARA ENVIAR UMA IMAGEM
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
