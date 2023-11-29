const https = require("https");

const whatsappMiddleware = (req, res, next) => {
  console.log("chegou no whatsappMiddleware");

//   let body = req.body;

//     // Check the Incoming webhook message
//     console.log(JSON.stringify(req.body, null, 2));

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
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

      console.log("dados:", whatsappNumber, from, msg_body);
      // Anexa as informações extraídas à solicitação para uso posterior
      req.whatsapp = {
        whatsappNumber,
        from,
        msg_body,
      };
      next();
    }
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }

};

// Função auxiliar para enviar resposta via WhatsApp
whatsappMiddleware.sendReply = (
  whatsappNumber,
  whatsapp_token,
  to,
  reply_message,
  resp,
) => {
    console.log("enviando resposta:", whatsappNumber, to)
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: { body: reply_message },
  });

  const path =
    "/v16.0/" + whatsappNumber + "/messages?access_token=" + whatsapp_token;
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
