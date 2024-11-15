const Pokemon = require('../models/Pokemon');

class PokemonRepository {
  async deleteAll() {
    return await Pokemon.deleteMany({});
  }

  async insertMany(pokemonData) {
    return await Pokemon.insertMany(pokemonData);
  }

  async findAll(offset, limit, excludeExternalIds){
    return await Pokemon.find({
      externalId: { $nin: excludeExternalIds } // $nin excluye los IDs que están en el array
    })
    .skip(offset)
    .limit(limit);
  };

  async countAll() {
    return await Pokemon.countDocuments();
  }

  async findByExternalId(externalId) {
    return await Pokemon.findOne({ externalId });
  }
}

module.exports = new PokemonRepository();
