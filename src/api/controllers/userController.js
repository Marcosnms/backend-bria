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

            res.status(201).json({ message: "Usuário criado com sucesso!", user: newUser });
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar a conta do usuário", message: error.message });
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

            res.status(200).json({ message: "Login bem-sucedido!", token });
        } catch (error) {
            res.status(500).json({ error: "Erro ao tentar logar." });
        }
    },

    // Outros métodos relacionados a usuários podem ser adicionados aqui
};

module.exports = userController;
