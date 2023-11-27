const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authService = {
    // Gerar um token JWT
    generateToken: (user) => {
        const payload = {
            userId: user.id,
            name: user.name
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    },

    // Verificar a senha do usuário
    verifyPassword: async (inputPassword, storedPassword) => {
        return bcrypt.compare(inputPassword, storedPassword);
    }

};

module.exports = authService;
