const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
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
                }
            });
            console.log("usuario criado com sucesso")
        } catch (error) {
            console.log("erro ao criar usuario", error)
        }
    },

    // Login do usuário
    loginUser: async (req, res) => {
        try {
            const { whatsappNumber } = req.body;
            const user = await prisma.user.findUnique({
                where: { whatsappNumber }
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            const payload = { userId: user.id, name: user.name };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });


        } catch (error) {

        }
    },

    // Outros métodos relacionados a usuários podem ser adicionados aqui
};

module.exports = userController;
