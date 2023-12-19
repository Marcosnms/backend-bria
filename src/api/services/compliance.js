const axios = require('axios');

const sendTermsAndPolicy = async (whatsappNumber, whatsappToken, to) => {
  try {
    const messageData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template: {
        name: "terms_and_policy", // Nome do template criado no WhatsApp
        language: {
          code: "pt_BR"
        },
      }
    };

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${whatsappNumber}/messages`,
      messageData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${whatsappToken}`
        }
      }
    );

    console.log("Mensagem enviada com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao enviar a mensagem:", error);
  }
};

module.exports = sendTermsAndPolicy;
