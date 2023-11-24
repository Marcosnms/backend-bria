const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.createUserAccount = async (req, res) => {
  const { name, whatsappNumber } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        whatsappNumber,
        privateKey: process.env.JWT_SECRET,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

