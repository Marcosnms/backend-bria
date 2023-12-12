const axios = require("axios");

const optionService = async (whatsappNumber, whatsapp_token, to, flow) => {
  // caso onboarding

  if (flow === "01") {
    try {
      console.log("chegou no optionService");
      console.log(whatsappNumber, whatsapp_token, to);

      const listMessage = {
        type: "list",
        header: {
          type: "text",
          text: "☰  Vamos começar",
        },
        body: {
          text: "Escolha a opção abaixo e deixe a magia acontecer! 🌟",
        },
        footer: {
          text: "BRIA, a Inteligência Coletiva da Borogoland",
        },
        action: {
          button: "escolher",
          sections: [
            {
              title: "Listagem de Serviços",
              rows: [
                {
                  id: "user_profile",
                  title: "👤 Seu perfil",
                  description:
                    "Configure seus objetivos, suas preferências e defina o SEU Borogodó!",
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
  } else {
    // caso não seja onboarding
    try {
      console.log("chegou no optionService");
      console.log(whatsappNumber, whatsapp_token, to);

      const listMessage = {
        type: "list",
        header: {
          type: "text",
          text: "☰  Funcionalidades",
        },
        body: {
          text: "Escolha uma opção abaixo e deixe a magia acontecer! 🌟",
        },
        footer: {
          text: "BRIA, a Inteligência Coletiva da Borogoland",
        },
        action: {
          button: "escolher",
          sections: [
            {
              title: "Listagem de Serviços",
              rows: [
                {
                  id: "user_profile",
                  title: "👤 Seu perfil",
                  description:
                    "Configure seus objetivos, suas preferências e defina o SEU Borogodó!",
                },
                {
                  id: "upgrade_2024",
                  title: "🚀 Upgrade KIT 2024",
                  description:
                    "Tudo o que você precisa saber em tecnologia para 2024",
                },
                {
                  id: "useful_links",
                  title: "🔗 Links úteis",
                  description: "Acesse recursos escolhidos a dedo para você!",
                },
                {
                  id: "members_area",
                  title: "👥 Área de Membros",
                  description:
                    "Eventos, Mentorias, Notificações, Ferramentas, Suporte e Acompanhamento.",
                },
                {
                  id: "borogoland_info",
                  title: "🌍 Sobre a Borogoland",
                  description:
                    "Descubra mais sobre nosso funcionamento e como participar.",
                },
                {
                  id: "central_servicos",
                  title: "💡Serviços Criativos ",
                  description:
                    "Procurando um profissional criativo? Explore a Central de Serviços.",
                },
                {
                  id: "wallet",
                  title: "🔐 Sua wallet",
                  description:
                    "Acesse sua Wallet e veja seus Borogodós acumulados. ",
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
  }
};

module.exports = optionService;
