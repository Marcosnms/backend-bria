const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const messageService = require("./messageService");

const getAllUserContacts = async () => {
  try {
    const users = await prisma.user.findMany({
      select: { whatsappNumber: true },
    });
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
      let message = "Feliz Natal e um próspero Ano Novo! 🎄🎅🏻🎁🎉🎊\n\n"+
      "Neste tempo de celebração e alegria, quero lembrar você do poder incrível que temos quando nos unimos e compartilhamos nossa criatividade, sonhos e esperança. O Natal é um momento para refletir sobre o amor, a bondade e a generosidade, não só com os que estão perto de nós, mas com toda a humanidade.\n\n"+
      "Em um mundo cada vez mais conectado, mas também marcado por divisões e desigualdades, é essencial lembrarmos da importância da união, da empatia e do respeito pelas diferenças. Ao incentivarmos ações pautadas no amor, na compreensão e na colaboração, estamos promovendo não apenas o bem-estar individual, mas também contribuindo para o progresso coletivo e a sustentabilidade do nosso planeta.\n\n"+
      "Vamos nos comprometer a construir pontes, não muros. Vamos escolher o amor e a compreensão acima de tudo. Nossas diferenças nos enriquecem, não nos separam. Juntos, podemos criar um mundo mais justo, pacífico e sustentável.\n\n"+
      "Que esta época festiva reacenda em seu coração a chama da esperança e da compaixão. Que o Ano Novo traga renovação e a oportunidade de transformarmos nossos sonhos mais ousados em realidade.\n\n"+
      "Agradecemos por fazer parte da nossa comunidade e por nos ajudar a construir a Borogoland. Boas festas e um Ano Novo repleto de alegrias, realizações e muito Borogodó! 💫🎉\n\n "+
      "Que 2024 seja um ano de muita saúde, paz, amor e prosperidade para todos nós! "+
      "🌟🌟🌟 BRIA & Equipe da Borogoland \n\n"
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
