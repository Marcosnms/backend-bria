const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const messageService = require("./messageService");

const getAllUserContacts = async () => {
  try {
    const users = await prisma.user.findMany({
      select: { whatsappNumber: true },
    });
    console.log("Usuários encontrados:", users);
    return users.map((user) => user.whatsappNumber);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
};

const sendMessageToAllUsers = async () => {
  const userContacts = await getAllUserContacts();
  console.log("userContacts", userContacts);

  userContacts.forEach(async (contact) => {
    const whatsappNumber = "140218249183817"; // Número do WhatsApp (pode ser um ID de negócio ou similar)
    try {
      let message = "Feliz Natal e um próspero Ano Novo! 🎄🎅🏻🎁🎉🎊\n\n";
      // Esta função depende do serviço de mensagens que você está utilizando
      await messageService(
        whatsappNumber,
        process.env.WHATSAPP_TOKEN,
        contact,
        message
      );
      console.log(`Mensagem enviada para ${contact}`);
      return
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${contact}:`, error);
    }
  });
};

module.exports = sendMessageToAllUsers;
