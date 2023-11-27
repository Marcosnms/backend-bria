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
                    createdAt: new Date.now(),
                }
            });

            res.status(201).json({ message: "Usuário criado com sucesso!", user: newUser });
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar a conta do usuário" });
        }
    },

    // Login do usuário
    loginUser: async (req, res) => {
        try {
            const { email, privateKey } = req.body;
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            const isMatch = await bcrypt.compare(privateKey, user.privateKey);
            if (!isMatch) {
                return res.status(400).json({ error: "Senha inválida." });
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
