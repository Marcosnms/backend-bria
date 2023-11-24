const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuração do Express -ok
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rotas -ok
const userRoutes = require('./src/api/routes/userRoutes');

// Definir rotas
app.use('/api/users', userRoutes);

// Lidar com endpoints não encontrados
app.use((req, res, next) => {
  res.status(404).send('Endpoint not found');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
