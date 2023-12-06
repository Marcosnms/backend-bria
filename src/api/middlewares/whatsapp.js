const { Console } = require("console");
const https = require("https");

const whatsappMiddleware = (req, res, next) => {
  console.log("chegou no whatsappMiddleware");

  // console.log("req.body:", JSON.stringify(req.body, null, 2));

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let whatsappNumber =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
      let msg_type = req.body.entry[0].changes[0].value.messages[0].type; // extract the message type from the webhook payload

      // 01. CASO A MENSAGEM SEJA DE TEXTO
      if (msg_type === "text") {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

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


          // OPÇÕES DISPONÍVEIS
          switch (selectedOptionId) {

            // 01. INFORMAÇÕES SOBRE A BOROGOLAND
            case "borogoland_info":
              // Envie uma mensagem de texto sobre a Borogoland
              req.response = {
                message: "Que bom que você quer saber mais sobre a Borogoland! A Borogoland é uma DAO que tem como objetivo ajudar as pessoas a alcançar a sustentabilidade criativa, social e financeira.",
                type: "text",
                flow: "02",
              }
              next();
              break
              
            // 02. LINKS ÚTEIS
            case "useful_links":
              // Envie uma lista com links úteis
              req.response = {
                message: "Vamos ter links bem legais aqui, mas por equanto ainda não. Pergunte-me outra coisa sobre a Borogoland e eu te responderei.",
                type: "text",
                flow: "02",
              }
              next();
              break
            
            // 03. ÁREA DE MEMBROS
            case "members_area":
              // Envie uma imagem representando a área de membros
              req.response = {
                message: "Em breve você saberá tudo para ser um membro! Olhe pelo lado positivo e veja que sua mensagem foi escolhida corretamente. Me pergunte alguma coisa sobre a Borogoland e eu te responderei.",
                type: "text",
                flow: "02",
              }
              next();
              break
          }
        }

        // Anexa as informações extraídas à solicitação para uso posterior

        // req.whatsapp = {
        //   whatsappNumber,
        //   from,
        //   name,
        //   img_type,
        //   img_id,
        // };
        // console.log("interactive:", req.whatsapp);
        // next();

        // 03. CASO A MENSAGEM SEJA DE IMAGEM
      } else if (msg_type === "image") {
        let img_type =
          req.body.entry[0].changes[0].value.messages[0].image.mime_type; // extract the message text from the webhook payload
        let img_id = req.body.entry[0].changes[0].value.messages[0].image.id; // extract the message text from the webhook payload
        // TODO: verificar se a imagem foi solicitada
        // TODO: Salvar a imagem em um bucket do Google Cloud Storage
        // Anexa as informações extraídas à solicitação para uso posterior
        req.whatsapp = {
          whatsappNumber,
          from,
          name,
          img_type,
          img_id,
        };
        console.log("imagem:", req.whatsapp);
        // next();

        // 04. CASO A MENSAGEM SEJA OUTRA
      } else {
        // TODO: ajustar a resposta para dizer que não aceita esse tipo de mensagem no momento
        console.log("Mensagem não suportada");
      }
    }
  }
};

// 01. FUNÇÃO PARA ENVIAR UMA MENSAGEM DE TEXTO - 0K

whatsappMiddleware.sendText = (whatsappNumber, whatsapp_token, to, reply_message) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      text: { body: reply_message },
    });

    const path = `/v18.0/${whatsappNumber}/messages?access_token=${whatsapp_token}`;
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
      response.on("end", () => {
        resolve(str); // Resolve a promessa quando a mensagem é enviada
      });
    };

    const req = https.request(options, callback);
    req.on("error", (e) => {
      console.error("Erro ao enviar mensagem de texto:", e);
      reject(e); // Rejeita a promessa em caso de erro
    });

    req.write(data);
    req.end();
  });
};


// 02. FUNÇÃO PARA ENVIAR A LISTA DE OPÇÕES - OK
whatsappMiddleware.sendListMessage = (whatsappNumber, whatsapp_token, to) => {
  return new Promise((resolve, reject) => {
    const listOptions = {
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "Escolha uma opção:"
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

// 02.01  FUNÇÃO PARA ENVIAR A LISTA DE OPÇÕES - TESTE
whatsappMiddleware.sendListMessage2 = (
  whatsappNumber,
  whatsapp_token,
  to,
  resp,
) => {
  const listOptions = {
    button: "Selecione a Opção",
    sections: [
      {
        title: "Escolha uma opção:",
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
        ],
      },
    ],
  };

  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: listOptions,
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
  console.log("Enviou Lista de Opções:", JSON.stringify(data, null, 2));
  resp.sendStatus(200);
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
