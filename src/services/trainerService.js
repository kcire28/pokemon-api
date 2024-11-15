const trainerRepository = require('../repositories/trainerRepository');
const pokemonRepository = require('../repositories/pokemonRepository');

exports.createTrainer = async ({ name, email }) => {
  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const existingTrainer = await trainerRepository.findByEmail(email);
  if (existingTrainer) {
    throw new Error('A trainer with this email already exists');
  }

  return await trainerRepository.create({ name, email, favorites: [] });
};

exports.addFavoritePokemon = async ({ trainerId, pokemonId }) => {
  const pokemon = await pokemonRepository.findByExternalId(pokemonId);
  if (!pokemon) {
    throw new Error('Pokemon not found');
  }

  const trainer = await trainerRepository.findById(trainerId);
  if (!trainer) {
    throw new Error('Trainer not found');
  }

  const isAlreadyFavorite = trainer.favorites.some(
    (fav) => fav.externalId === pokemon.externalId
  );

  if (isAlreadyFavorite) {
    return { message: 'Pokemon is already in favorites', trainer };
  }

  trainer.favorites.push(pokemon.toObject());
  await trainerRepository.updateFavorites(trainer);

  return { message: 'Pokemon added to favorites', trainer };
};

exports.getFavoritesByTrainer = async (trainerId, page = 1, limit = 10) => {
  const trainer = await trainerRepository.findAllFavoritesByTrainerId(
    trainerId,
    (page - 1) * limit,
    limit
  );

  if (!trainer) {
    throw new Error('Trainer not found');
  }

  return {
    currentPage: page,
    totalPages: Math.ceil(trainer.favorites.length / limit),
    favorites: trainer.favorites,
  };
};

exports.removeFavoritePokemon = async (trainerId, externalId) => {
  const trainer = await trainerRepository.findById(trainerId);
  if (!trainer) {
    throw new Error('Trainer not found');
  }

  const favoriteIndex = trainer.favorites.findIndex(
    (fav) => fav.externalId === externalId
  );

  if (favoriteIndex === -1) {
    throw new Error('Pokemon not found in favorites');
  }

  trainer.favorites.splice(favoriteIndex, 1);
  await trainerRepository.updateFavorites(trainer);

  return { message: 'Pokemon removed from favorites', trainer };
};

exports.findTrainerByEmail = async (email) => {
  const trainer = await trainerRepository.findByEmail(email);
  if (!trainer) {
    throw new Error('Trainer not found');
  }
  return trainer;
};
