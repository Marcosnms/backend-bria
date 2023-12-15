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
        "country",
        "state",
        "city",
        "age",
        "educationLevel",
        "profession",
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
        "country",
        "state",
        "city",
      ];

      for (const field of fieldsToCheck) {
        if (basicProfile[field] === null || basicProfile[field].trim() === "") {
          return field;
        }
      }

      return 8;
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
  

  // Retorna o score do AdvancedProfile
};

module.exports = userController;
