const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoUrI } = require('../config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokedex API',
      version: '1.0.0',
      description: 'API for resolve Fulltime force test',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ruta a tus archivos de rutas donde agregarás los comentarios Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Usar Swagger UI para visualizar la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function connectToDatabase() {
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.connect(mongoUrI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection established successfully');
  }
}

connectToDatabase();

const pokemonRoutes = require('./routes/pokemons');
app.use('/pokemons', pokemonRoutes);

const trainerRoutes = require('./routes/trainers');
app.use('/trainers', trainerRoutes);

const connection = mongoose.connection;
module.exports = { app, connection };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
