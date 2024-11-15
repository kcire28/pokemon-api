const trainerService = require('../services/trainerService');

exports.createTrainer = async (req, res) => {
  try {
    const trainer = await trainerService.createTrainer(req.body);
    res.status(201).json({ message: 'Trainer created successfully', trainer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addFavoritePokemon = async (req, res) => {
  try {
    const { trainerId, pokemonId } = req.body;
    const result = await trainerService.addFavoritePokemon({ trainerId, pokemonId });
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Pokemon not found' || error.message === 'Trainer not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding Pokemon to favorites', error: error.message });
  }
};

exports.getFavoritesByTrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    const { page = 1, limit = 10 } = req.query;

    const result = await trainerService.getFavoritesByTrainer(trainerId, page, limit);
    return res.json(result);
  } catch (error) {
    if (error.message === 'Trainer not found') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving favorites' });
  }
};

exports.findTrainerByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const trainer = await trainerService.findTrainerByEmail(email);
    res.status(200).json({ trainer });
  } catch (error) {
    if (error.message === 'Trainer not found') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.status(500).json({ message: 'Error fetching trainer', error: error.message });
  }
};

exports.removeFavoritePokemon = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { externalId } = req.body;

    const result = await trainerService.removeFavoritePokemon(trainerId, externalId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Trainer not found') {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    if (error.message === 'Pokemon not found in favorites') {
      return res.status(404).json({ message: 'Pokemon not found in favorites' });
    }
    res.status(500).json({ message: 'Error removing Pokemon from favorites', error: error.message });
  }
};