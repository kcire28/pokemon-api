const axios = require('axios');
const pokemonRepository = require('../repositories/pokemonRepository');
const trainerRepository = require('../repositories/trainerRepository');
const { pokeApiUrl, pokeMonSize } = require('../../config');


exports.syncPokemons = async () => {
  const response = await axios.get(`${pokeApiUrl}/pokemon?limit=${pokeMonSize}`);
  
  const pokemonList = response.data.results;
  const detailedPokemonData = [];

  await Promise.all(pokemonList.map(async (pokemon, index) => {
    try {
      const detailsResponse = await axios.get(pokemon.url);
      const details = detailsResponse.data;

      if(details){
        await pokemonRepository.deleteAll();
      }

      detailedPokemonData.push({
        externalId: index + 1,
        name: pokemon.name,
        url: pokemon.url,
        abilities: details.abilities,
        base_experience: details.base_experience,
        height: details.height,
        image_icon: details.sprites.front_default,
        image: details.sprites.other['official-artwork'].front_default
      });

    } catch (detailsError) {
      console.error(`Error fetching details for ${pokemon.name}:`, detailsError);
    }
  }));

  await pokemonRepository.insertMany(detailedPokemonData);

  return { message: 'Pokémon data synchronized successfully' };
};

exports.getAllPokemons = async (page = 1, limit = 10, trainerId) => {
  const limitParsed = parseInt(limit);
  if (isNaN(limitParsed) || limitParsed <= 0) {
    throw new Error('The limit parameter must be a number greater than 0');
  }

  const trainer = await trainerRepository.findById(trainerId);
  const favoriteExternalIds = trainer ? trainer.favorites.map(fav => fav.externalId) : [];

  const pokemons = await pokemonRepository.findAll(
    (page - 1) * limitParsed,
    limitParsed,
    favoriteExternalIds
  );

  const totalPokemons = await pokemonRepository.countAll();
  const totalPages = Math.ceil(totalPokemons / limitParsed);

  return {
    currentPage: page,
    totalPages,
    totalPokemons,
    pokemons,
  };
};

exports.searchByExternalId = async (externalId) => {
  if (!externalId) {
    throw new Error('The externalId parameter is required');
  }

  const pokemon = await pokemonRepository.findByExternalId(externalId);
  if (!pokemon) {
    throw new Error('Pokemon not found');
  }

  return pokemon;
};
