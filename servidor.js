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

    if (req.whatsapp && req.response) {

      whatsappMiddleware.sendListMessage2(
        whatsappNumber,
        process.env.WHATSAPP_TOKEN,
        from,
        res
      );

      // if (req.response.type === "text") {
      //   // Envia uma mensagem de texto
      //   whatsappMiddleware
      //     .sendText(
      //       whatsappNumber,
      //       process.env.WHATSAPP_TOKEN,
      //       from,
      //       replyMessage
      //     )
      //     .then(() => {
      //       if (req.response.flow === "01") {
      //         // Se for um novo usuário, aguarde e envie a lista de opções
      //         console.log("esperando 1 segundos");
      //         return new Promise((resolve) => setTimeout(resolve, 1000)).then(
      //           () => {
      //             return whatsappMiddleware.sendListMessage(
      //               whatsappNumber,
      //               process.env.WHATSAPP_TOKEN,
      //               from
      //             );
      //           }
      //         );
      //       }
      //     })
      //     .then(() => {
      //       console.log("mensagem enviada");
      //       res.sendStatus(200); // Envie a resposta HTTP após todas as ações
      //     })
      //     .catch((error) => {
      //       console.error("Erro ao enviar mensagem:", error);
      //       res.status(500).send("Erro interno do servidor");
      //     });
      // } else if (req.response.type === "interative") {
      //   // 02. ENVIA UMA LISTA DE OPÇÕES
      //   whatsappMiddleware.sendText(
      //     whatsappNumber,
      //     process.env.WHATSAPP_TOKEN,
      //     from,
      //     "Desculpe, ainda não tenho o poder de processar imagens... está chegando em breve. Mas por enquanto, por gentileza, tente novamente utilizando um texto.",
      //   );

      //   console.log("mensagem interativa");
      // } else if (req.response.type === "image") {
      //   // 03. ENVIA UMA IMAGEM
      //   whatsappMiddleware.sendText(
      //     whatsappNumber,
      //     process.env.WHATSAPP_TOKEN,
      //     from,
      //     "Desculpe, ainda não tenho o poder de processar imagens... está chegando em breve. Mas por enquanto, por gentileza, tente novamente utilizando um texto.",
      //   );

      //   console.log("mensagem de imagem");
      // }
    } else {
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
