const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.teste = async (req, res) => {
  console.log('Teste server');
  return res.status(200).json({ message: 'Hello World' });
};