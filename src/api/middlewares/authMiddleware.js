const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers['authorization']; // O token geralmente é enviado no cabeçalho 'Authorization'

    if (!token) {
      return res.status(403).send('Um token é necessário para autenticação');
    }

    try {
      // O 'Bearer' é um prefixo comum para tokens de autorização, então removemos para obter o token puro
      const bearerToken = token.split(' ')[1];
      
      // Verifica o token usando a chave secreta
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(401).send('Token inválido');
    }
    return next(); // Passa o controle para a próxima função middleware na cadeia
  },

  // Aqui você pode adicionar outros middlewares de autenticação se necessário
};

module.exports = authMiddleware;
