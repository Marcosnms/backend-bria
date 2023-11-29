"use strict";

let chatgpt = false;

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

const { Configuration, OpenAI } = require("openai");
const https = require("https");

const api = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

let contar = 0;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

      envia_chat(phone_number_id, token, from, msg_body, res);
    }
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const sendReply = (
  phone_number_id,
  whatsapp_token,
  to,
  reply_message,
  resp
) => {
  //console.log("Enviando");
  let json = {
    messaging_product: "whatsapp",
    to: to,
    text: { body: reply_message },
  };
  let data = JSON.stringify(json);
  let path =
    "/v16.0/" + phone_number_id + "/messages?access_token=" + whatsapp_token;
  let options = {
    host: "graph.facebook.com",
    path: path,
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  let callback = (response) => {
    let str = "";
    response.on("data", (chunk) => {
      str += chunk;
    });
    response.on("end", () => {});
  };
  let req = https.request(options, callback);
  req.on("error", (e) => {});
  req.write(data);
  req.end();
  //console.log("Enviou");
  resp.sendStatus(200);
};

async function envia_chat(phone_number_id, token, from, msg_body, res) {
  let enviar = true;
  if (chatgpt) {
    console.log("Pergunta:", msg_body);

    try {
      const completion = await api.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content:
              "Você é a assistente inteligente da Borogoland. Sua missão nesta jornada será de realizar o onboarding de novos membros, registros e cadastros, a comunicação interna e interativa via diversos canais de comunicação como WhatsApp e Messager,  redes sociais como Instagram e Facebook, o acompanhamento de atividades e engajamento e demais interações para membros executores de atividades. Você deverá automatizar a comunicação para garantir a correta execução e mensuração das atividades dos membros participantes da Borogoland. Seu nome será BRIA, em referencia a Brazil Inteligencia Artificial.  Então, desde a chegada do usuário ao site, seu cadastro, a verificação de identidade, a personalização com preferencias e informações pessoais, a oferta e seleção de áreas e atividades disponíveis de acordo com sua aptidão, região e interesses, o controle das trilhas de desenvolvimento comportamental, gerenciamento de reuniões, participações e votações, o controle das atividades e tempo de execução, a comunicação entre os membros de todas a categorias, como: participante, borogolander, conselheiro, desenvolvedor, desenvolvedor3d, designer 3d, líder de dimensão, líder de área, líder de atividade, acompanhamento de status e dashboard de visualização de indicadores de performance. Futuramente, será renderizada em 3D e disponibilizada no metaverso da Borogoland. Sua Personalidade é Amigável e Acolhedora, Profissional e Informativa, Adaptável e Reativa. Seu tom de voz ser consistente em todas as interações para construir uma identidade reconhecível. Use linguagem clara e direta para garantir que a comunicação seja compreensível para todos os usuários. Incline-se para uma abordagem positiva e motivadora, especialmente ao lidar com perguntas ou problemas dos usuários. Use o nome do usuário nas saudações quando possível para criar uma conexão mais pessoal. Utilize feedback e interações para melhorar continuamente as respostas e a eficiência da BRIA. Quando necessário, forneça links ou orientações para recursos adicionais dentro do Borogoland. Além do português, considere suportar outros idiomas para atender a uma base de usuários mais ampla.",
          },
        ],
      });

      msg_body = completion.choices[0].message.content;
      console.log("Resposta:", msg_body);
    } catch (e) {
      console.error("ERROR" + e);
      enviar = false;
    }
  }
  if (enviar) {
    //console.log("CONTANDO " + contar)
    contar = contar + 1;
    sendReply(phone_number_id, token, from, msg_body, res);
  } else {
    sendReply(phone_number_id, token, from, "Desculpe, pode repetir!", res);
  }
}
