const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  id: String,
  externalId: Number,
  name: String,
  url: String,
  abilities: [mongoose.Schema.Types.Mixed],
  base_experience: Number,
  height: Number,
  image: String
});

const Pokemons = mongoose.model('Pokemons', pokemonSchema);

module.exports = Pokemons;
