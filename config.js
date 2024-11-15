require('dotenv').config();

module.exports = {
  pokeApiUrl: process.env.POKEAPI_URL,
  pokeMonSize: process.env.POKEMONS_SIZE,
  mongoUrI: process.env.MONGO_URI,
};