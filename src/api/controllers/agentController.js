const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { OpenAI } = require("openai");

const agentController = {
  createAgents: async (userId) => {
    try {
      console.log("Criando agentes e threads para o usuário:", userId);
      const flows = {
        upgrade: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir sobre as trilhas de conhecimento disponíveis",
        },
        metaverso: {
          assistant: "trilhaMetaverso",
          id: "asst_IegtsEo3EGtThrevBFRZGx7o",
          objective: "ensinar sobre o desenvolvimento de metaversos",
        },
        ia: {
          assistant: "trilhaIa",
          id: "asst_u9HqxhXaLMhkZXlIp1Nzgztw",
          objective:
            "ensinar sobre como inteligência artificial nos seus projetos",
        },
        web3: {
          assistant: "trilhaWeb3",
          id: "asst_TQvohPwJUhx50dzjY133b8FH",
          objective: "ensinar sobre como usar a web3 nos seus projetos",
        },
        info: {
          assistant: "borogoland",
          id: "asst_e7oFN5DcE2xLQ8DyN2IXrSg7",
          objective: "instruir sobre a borogoland",
        },
        members: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir sobre a área de membros",
        },
        eventos: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir sobre os eventos",
        },
        mentoria: {
          assistant: "5do",
          id: "asst_aaxgUAq3Dq11l113uTXr4pOX",
          objective:
            "criar rotina de mentoria diária de acordo com a metodologia 5DO",
        },
        lista: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective:
            "instruir sobre a lista de membros e como interagir com ela",
        },
        borogodao: {
          assistant: "borogodao",
          id: "asst_p29wfkjR4rjfwQfmaqqVNnLf",
          objective: "instruir sobre a DAO da borogoland",
        },
        perfil: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir sobre o perfil do usuário e fazer atualizações",
        },
        serviços: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective:
            "instruir sobre os serviços criativos, como usar e como oferecer",
        },
        wallet: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir sobre a wallet e como usar os BRGDs",
        },
        borogodometro: {
          assistant: "borogodometro",
          id: "asst_VB0MmSFaSEwJHh0w4mfCmGVQ",
          objective: "instruir sobre como realizar o borogodometro as análises",
        },
        suporte: {
          assistant: "bria",
          id: "asst_Hms8rIpqzC0PcMKVmYfy17AD",
          objective: "instruir o usuário na dúvida ou problema que ele tem",
        },
      };
      const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const agentCreationPromises = Object.entries(flows).map(
        async ([flow, { id, objective }]) => {
          const createThread = async () => {
            const thread = await api.beta.threads.create();
            return thread;
          };

          const thread = await createThread();
          const newThreadId = thread.id;

          return await prisma.agent.create({
            data: {
              userId: userId,
              flow: flow,
              thread: newThreadId,
              assistant: id,
              objective: objective,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isActive: true,
            },
          });
        }
      );

      await Promise.all(agentCreationPromises);
      console.log("Todos os agentes e threads criados para o usuário:", userId);

    } catch (error) {
      console.error(
        "Erro ao criar agentes e threads para o usuário:",
        userId,
        error
      );
    }
  },

  getAgent: async (userId, flow) => {
    try {
      const agent = await prisma.agent.findFirst({
        where: {
          userId: userId, // Usa diretamente o userId
          flow: flow,     // Usa diretamente o flow
          deletedAt: null // Supondo que você queira filtrar por agentes não deletados
        },
      });

      return agent;
    } catch (error) {
      console.error("Erro ao buscar o agente:", error);
      return null;
    }
  },
  

};

module.exports = agentController;
