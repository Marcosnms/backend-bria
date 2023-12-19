const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  // Criação de conta de usuário
  createUserAccount: async (req, res) => {
    try {
      const { name, whatsappNumber, privateKey } = req.body;
      const hashedPassword = await bcrypt.hash(privateKey, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          whatsappNumber,
          privateKey: hashedPassword,
        },
      });
      console.log("usuario criado com sucesso");
    } catch (error) {
      console.log("erro ao criar usuario", error);
    }
  },

  // Login do usuário
  loginUser: async (req, res) => {
    try {
      const { whatsappNumber } = req.body;
      const user = await prisma.user.findUnique({
        where: { whatsappNumber },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const payload = { userId: user.id, name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
    } catch (error) {}
  },

  // Altera o status do ActiveFlow
  changeActiveFlow: async (userId, activeFlow) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { activeFlow },
      });
    } catch (error) {
      console.log("Erro ao alterar o status do ActiveFlow:", error);
    }
  },

  // Retorna o score do BasicProfile

  scoreBasicProfile: async (userId) => {
    try {
      // Busca o BasicProfile do usuário
      const basicProfile = await prisma.basicProfile.findUnique({
        where: { userId: userId },
      });

      if (!basicProfile) {
        return 0;
      }

      // Lista de campos a serem verificados
      const fieldsToCheck = [
        "nickname",
        "gender",
        "age",
        "educationLevel",
        "profession",
        "segment",
        "country",
        "state",
        "city",
      ];

      // Conta os campos preenchidos
      let filledFieldsCount = 0;
      fieldsToCheck.forEach((field) => {
        if (basicProfile[field] && basicProfile[field].trim() !== "") {
          filledFieldsCount++;
        }
      });

      return filledFieldsCount;
    } catch (error) {
      console.error("Erro ao contar campos preenchidos:", error);
      throw error;
    }
  },

  // busca a próxima pergunta do BasicProfile

  getNextBasicProfileQuestion: async (userId) => {
    try {
      const basicProfile = await prisma.basicProfile.findUnique({
        where: { userId: userId },
      });

      if (!basicProfile) {
        return "nickname";
      }

      const fieldsToCheck = [
        "nickname",
        "gender",
        "age",
        "educationLevel",
        "profession",
        "segment",
        "country",
        "state",
        "city",
      ];

      for (const field of fieldsToCheck) {
        if (basicProfile[field] === null || basicProfile[field].trim() === "") {
          return field;
        }
      }

      return 9;
    } catch (error) {
      console.error("Erro ao encontrar o primeiro campo vazio:", error);
      throw error;
    }
  },

  // salva o openFlow na tabela User

  saveOpenFlow: async (userId, openFlow) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { openFlow },
      });
    } catch (error) {
      console.log("Erro ao salvar o openFlow:", error);
    }
  },

  // busca o openFlow na tabela User

  getOpenFlow: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user.openFlow;
    } catch (error) {
      return null;
    }
  },

  getActiveFlow: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user.activeFlow;
    } catch (error) {
      return null;
    }
  },

  // salva o nickname na tabela BasicProfile

  saveBasicProfileData: async (userId, field, value) => {
    try {
      // Verifica se já existe um BasicProfile para este userId
      const existingProfile = await prisma.basicProfile.findUnique({
        where: { userId: userId },
      });

      // Se não existir, cria um novo BasicProfile
      if (!existingProfile) {
        await prisma.basicProfile.create({
          data: {
            userId: userId,
            [field]: value,
            // Inclua outros campos com valores padrão, se necessário
          },
        });
        console.log("BasicProfile criado com sucesso.");
      } else {
        // Se existir, atualiza o campo específico
        await prisma.basicProfile.update({
          where: { userId: userId },
          data: { [field]: value },
        });
        console.log("BasicProfile atualizado com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao criar ou atualizar o BasicProfile:", error);
      throw error;
    }
  },

  //  Busca o baseicProfile

  getBasicProfile: async (userId) => {
    try {
      // Busca o perfil básico do usuário no banco de dados
      const basicProfile = await prisma.basicProfile.findUnique({
        where: { userId: userId },
      });

      if (!basicProfile) {
        throw new Error("Perfil básico não encontrado.");
      }

      // Formata os dados para serem interpretados pela OpenAI
      // Convertendo os dados do perfil em uma string JSON ou em um formato legível
      const formattedProfile = {
        nickname: basicProfile.nickname || "não especificado",
        gender: basicProfile.gender || "não especificado",
        country: basicProfile.country || "não especificado",
        state: basicProfile.state || "não especificado",
        city: basicProfile.city || "não especificado",
        age: basicProfile.age || "não especificado",
        educationLevel: basicProfile.educationLevel || "não especificado",
        profession: basicProfile.profession || "não especificado",
        segment: basicProfile.segment || "não especificado",
      };

      return (formattedProfile); // Ou retorne o objeto diretamente, dependendo de sua preferência
    } catch (error) {
      console.error("Erro ao buscar o perfil básico do usuário:", error);
      throw error;
    }
  },

  // função para salvar a resposta do usuário sobre o compliance

  saveCompliance: async (userId, answer) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { compliance: answer },
      });
    } catch (error) {
      console.log("Erro ao salvar a resposta do usuário sobre o compliance:", error);
    }
  },

  // function to get the compliance answer

  getCompliance: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user.compliance;
    } catch (error) {
      return null;
    }
  },

  // Retorna o score do AdvancedProfile
};

module.exports = userController;
