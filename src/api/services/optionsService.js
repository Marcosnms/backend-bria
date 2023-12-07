const axios = require("axios");

const optionService = async (whatsappNumber, whatsapp_token, to) => {
  try {
    console.log("chegou no optionService");
    console.log(whatsappNumber, whatsapp_token, to);

    const listMessage = {
      type: "list",
      header: {
        type: "text",
        text: "Menu de Opções",
      },
      body: {
        text: "Escolha uma opção:",
      },
      footer: {
        text: "Borogoland",
      },
      action: {
        button: "Opções",
        sections: [
          {
            title: "Menu Principal",
            rows: [
              {
                id: "borogoland_info",
                title: "Sobre a Borogoland",
                description: "Saiba mais sobre a Borogoland",
              },
              {
                id: "useful_links",
                title: "Links Úteis",
                description: "Acesse links úteis",
              },
              {
                id: "members_area",
                title: "Área de Membros",
                description: "Informações sobre a área de membros",
              },
              {
                id: "user_profile",
                title: "Perfil do Usuário",
                description: "Veja seu perfil",
              },
            ],
          },
        ],
      },
    };
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: listMessage,
    };

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${whatsappNumber}/messages`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${whatsapp_token}`,
        },
      }
    );

    console.log("Lista de opções enviada com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao enviar lista de opções:", error);
  }
};

module.exports = optionService;
