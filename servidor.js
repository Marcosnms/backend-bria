"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Importação de rotas
const userRoutes = require("./src/api/routes/userRoutes");
const chatRoutes = require("./src/api/routes/chatRoutes");
const interactionRoutes = require("./src/api/routes/interactionRoutes");

// Importação de middlewares
const whatsappMiddleware = require("./src/api/middlewares/whatsapp");
const openaiMiddleware = require("./src/api/middlewares/openai");
const handleMessages = require("./src/api/middlewares/handleMessages");

// Importação de Serviços
const messageService = require("./src/api/services/messageService");
const optionsService = require("./src/api/services/optionsService");
const sendMessageToAllUsers = require("./src/api/services/interactionService");

// Configuração do dotenv
dotenv.config();

// Inicializa o aplicativo Express
const app = express();

// Middleware para CORS, BodyParser e JSON
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar rotas da API
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/interactions", interactionRoutes);

// Rota de webhook para o WhatsApp

app.post(
  "/webhook",
  whatsappMiddleware,
  handleMessages,
  openaiMiddleware,
  (req, res) => {
    const { whatsappNumber, from } = req.whatsapp;

    console.log("chegou no webhook");

    // ENVIA RESPOSTA PARA O USUÁRIO
    if (req.whatsapp && req.response) {
      const replyMessage = req.response.message;

      console.log("FLOW:", req.response.flow);

      if (req.response.type === "text") {
        // Envia uma mensagem de texto
        whatsappMiddleware.sendText(
          whatsappNumber,
          process.env.WHATSAPP_TOKEN,
          from,
          replyMessage,
          res
        );

        // onboarding
        const flow = req.response.flow;
        if (flow === "chegada") {
          // msge 01
          setTimeout(() => {
            let message =
              "🌟 O que eu posso fazer por você? Vamos ver... ah, sim! Posso te ajudar a descobrir e aprimorar seus talentos, conectar você a uma comunidade vibrante de mentes criativas e até mesmo encontrar oportunidades únicas que combinem com seu perfil e seus sonhos. Não é só isso, tenho uma lista de opções cheia de cursos, eventos, e dicas personalizadas só esperando para ser explorada por você!";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 10000);

          // msge 02
          setTimeout(() => {
            let message = "Mas espera, tem mais! 🎉";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 30000);

          // msge 03
          setTimeout(() => {
            let message =
              "👥 Na nossa Área de Membros, você encontra eventos exclusivos, mentoria que realmente faz a diferença e, claro, aquele suporte amigo para te acompanhar em cada passo. E não podemos esquecer dos nossos serviços criativos, onde você pode oferecer ou contratar serviços com um toque especial de Borogodó!";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 35000);

          // msge 04
          setTimeout(() => {
            let message =
              "🤑 E sua Wallet? Ah, prepare-se para mergulhar em um mundo Web3 de recompensas e oportunidades, tudo dentro de sua carteira digital segura, onde você pode ganhar e gastar seus tão merecidos Borogodós (BRGD)!";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 50000);

          // msge 05
          setTimeout(() => {
            let message =
              "Então, o que você está esperando? Vamos embarcar nesta aventura juntos? Basta escolher a opção 👤 Novo Perfil e eu te guio pelo nosso caminho cheio de descobertas e alegrias.";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 65000);

          // msge 06
          setTimeout(() => {
            let message =
              "Lembre-se, aqui na Borogoland, cada passo seu é um passo em direção ao sucesso e à realização criativa! Vamos construir essa história juntos? 🚀";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 75000);

          // msge 07
          setTimeout(() => {
            let message =
              "Com carinho,\n BRIA, sua parceira na jornada criativa! 🌟";
            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 80000);

          // msge 08
          setTimeout(() => {
            let message =
              "Antes de mergulharmos no universo cheio de borogodó da Borogoland, precisamos de um instante para falar sobre algumas coisas importantes.\n\n" +
              "*Termos de Uso:* https://www.borogoland.com/termos-de-uso/\n\n" +
              "*Política de Privacidade:* https://www.borogoland.com/politicas-de-privacidade/\n\n" +
              "Ao clicar em 👤 Novo Perfil, você concorda com nossos Termos de Uso e Política de Privacidade. Nesses documentos, explicamos como cuidamos dos seus dados, seus direitos enquanto usuário e outras informações cruciais. Prometemos não usar juridiquês complicado! 😉";

            messageService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              message
            );
          }, 85000);

          // msge 09
          setTimeout(() => {
            optionsService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              flow
            );
          }, 100000);
        }

        // TODO: montar as funções para os outros flows
        else if (flow === "menu") {
          setTimeout(() => {
            optionsService(
              whatsappNumber,
              process.env.WHATSAPP_TOKEN,
              from,
              flow
            );
          }, 3000); // 000 milissegundos equivalem a 1 segundo
        }

        // se for uma consulta
        // se for o perfil
        // se for sobre cursos
        // se for sobre eventos
        // se for sobre membros
      }
    } else {
      console.log("outro tipo de mensagem");
      res.status(500).send("Erro ao processar a mensagem");
    }
  }
);

// Rota de verificação do webhook (necessária para a configuração inicial do webhook)
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// rota de testes de compliance
app.post("/compliance", (req, res) => {
  console.log("chegou no compliance");

  sendTermsAndPolicy(
    req.body.whatsappNumber,
    req.body.whatsapp_token,
    req.body.to
  );

  console.log(req.body);
  res.status(200).send("ok");
});

// rota de testes de webmsg
app.post("/webmsg", (req, res) => {
  console.log("chegou no webmsgevent");

  messageService(
    req.body.whatsappNumber,
    req.body.whatsapp_token,
    req.body.to,
    req.body.message
  );

  console.log(req.body);
  res.status(200).send("ok");
});

// rota de testes de optionmsg
app.post("/optionmsg", (req, res) => {
  console.log("chegou no webmsgevent");

  optionsService(
    req.body.whatsappNumber,
    req.body.whatsapp_token,
    req.body.to,
    req.body.flow
  );

  console.log(req.body);
  res.status(200).send("ok");
});

// Rota de mensagem manual
app.post("/feliznatal", (req, res) => {
sendMessageToAllUsers();
});


// Rota de teste (opcional)
app.get("/", (req, res) => {
  res.send("Backend da BRIA está funcionando!");
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
