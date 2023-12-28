const axios = require("axios");

const optionService = async (whatsappNumber, whatsapp_token, to, flow) => {
  // caso onboarding
  if (flow === "chegada") {
    try {
      console.log("chegou no optionService");
      console.log(whatsappNumber, whatsapp_token, to);

      const listMessage = {
        type: "list",
        header: {
          type: "text",
          text: "😀 vamos começar",
        },
        body: {
          text: "Clique no botão avançar e deixe a magia acontecer! 🌟",
        },
        footer: {
          text: "BRIA, a Inteligência Coletiva da Borogoland",
        },
        action: {
          button: "avançar",
          sections: [
            {
              title: "Listagem de Serviços",
              rows: [
                {
                  id: "onboarding",
                  title: "👤 Novo Perfil",
                  description:
                    "clique aqui para definir suas preferências e SEU Borogodó!",
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
  // caso membros
  else if (flow === "membros") {
    try {
      console.log("chegou no optionService");
      console.log(whatsappNumber, whatsapp_token, to);

      const listMessage = {
        type: "list",
        header: {
          type: "text",
          text: "👥 Área de Membros",
        },
        body: {
          text: "Veja a lista de opções exclusivas para membros da Borogoland",
        },
        footer: {
          text: "BRIA, a Inteligência Coletiva da Borogoland",
        },
        action: {
          button: "ver lista",
          sections: [
            {
              title: "Menu para membros",
              rows: [
                {
                  id: "mentoria",
                  title: "👩‍🏫 Mentoria",
                  description: "mentoria diária com a metodologia 5DO",
                },
                {
                  id: "eventos",
                  title: "📅 Eventos",
                  description: "confira eventos da Borogoland",
                },
                {
                  id: "lista",
                  title: "📋 Lista de Membros",
                  description: "pesquise na lista de membros da Borogoland",
                }, 
                {
                  id: "suporte",
                  title: "🛠️ Suporte",
                  description: "precisando de alguma ajuda? clique aqui pra falar com gente",
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
      console.log("Lista de opções enviada com sucesso");
    } catch (error) {
      console.error("Erro ao enviar lista de opções:", error);
    }
  }
  // caso menu
  else {
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
                  id: "profile",
                  title: "👤 Seu Perfil",
                  description: "qual o seu Borogodó",
                },
                // {
                //   id: "borogodometro",
                //   title: "🌟 Borogodômetro",
                //   description:
                //     "qual o nível do seu Borogodó",
                // },
                {
                  id: "upgrade",
                  title: "🚀 Upgrade Kit",
                  description: "trilhas para aumentar o poder do seu Borogodó",
                },
                // {
                //   id: "members",
                //   title: "👥 Área de Membros",
                //   description:
                //     "criando conexões e oportunidades para você",
                // },
                // {
                //   id: "servicos",
                //   title: "💡Serviços Criativos ",
                //   description:
                //     "oportunidades de jobs",
                // },
                // {
                //   id: "wallet",
                //   title: "🤑 Sua Wallet",
                //   description:
                //     "acesse sua carteira virtual e veja seus BRGDs acumulados",
                // },
                //   id: "dao",
                //   title: "🤝 DAO da Borogoland",
                //   description:
                //     "comunidade de descentralização da Borogoland",
                // },
                {
                  id: "info",
                  title: "🌍 Sobre a Borogoland",
                  description: "informações sobre a terra do Borogodó",
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

      console.log("Lista de opções enviada com sucesso");
    } catch (error) {
      console.error("Erro ao enviar lista de opções:", error);
    }
  }
};

module.exports = optionService;
