const axios = require("axios");

const sendGenderTypes = async (whatsappNumber, whatsappToken, to) => {
  try {
    const messageData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Escolha sua opção:",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "feminino",
                title: "feminino",
              },
            },
            {
              type: "reply",
              reply: {
                id: "masculino",
                title: "masculino",
              },
            },
            {
              type: "reply",
              reply: {
                id: "outro",
                title: "outro",
              },
            },
          ],
        },
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${whatsappNumber}/messages`,
      messageData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${whatsappToken}`,
        },
      }
    );

    console.log("Mensagem enviada com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao enviar a mensagem:", error);
  }
};

module.exports = sendGenderTypes;
