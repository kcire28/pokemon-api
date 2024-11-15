const pokemonService = require('../services/pokemonService');

exports.syncPokemons = async (req, res) => {
  try {
    const result = await pokemonService.syncPokemons();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching or inserting data:', error);
    res.status(500).send('Error fetching or inserting data');
  }
};

exports.getAllPokemons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { trainerId } = req.params;

    if (!trainerId) {
      return res.status(400).json({ message: 'Trainer ID is required' });
    }
    
    const result = await pokemonService.getAllPokemons(page, limit, trainerId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'The limit parameter must be a number greater than 0') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error fetching Pokémon:', error);
    res.status(500).send('Error fetching Pokémon');
  }
};

exports.searchByExternalId = async (req, res) => {
  try {
    const externalId = req.params.externalId;
    const pokemon = await pokemonService.searchByExternalId(externalId);
    res.status(200).json({ pokemon });
  } catch (error) {
    if (error.message === 'The externalId parameter is required') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Pokemon not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).send('Error fetching Pokémon');
  }
};
