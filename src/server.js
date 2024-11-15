const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoUrI } = require('../config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

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
