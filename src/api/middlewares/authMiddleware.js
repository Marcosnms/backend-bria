const jwt = require('jsonwebtoken');

const authMiddleware = {
    verifyToken: (req, res, next) => {
        // Obter o token do cabeçalho da solicitação
        const token = req.headers.authorization?.split(' ')[1]; // Assume formato "Bearer TOKEN"

        if (!token) {
            return res.status(403).json({ error: "Acesso negado. Token não fornecido." });
        }

        try {
            // Verificar o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Adicionar dados do usuário decodificados à solicitação
            next();
        } catch (error) {
            res.status(401).json({ error: "Token inválido." });
        }
    }
};

module.exports = authMiddleware;
