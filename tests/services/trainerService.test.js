const trainerService = require('../../src/services/trainerService');
const trainerRepository = require('../../src/repositories/trainerRepository');
const pokemonRepository = require('../../src/repositories/pokemonRepository');
const sinon = require('sinon');

// Test configuration
jest.mock('../../src/repositories/trainerRepository');
jest.mock('../../src/repositories/pokemonRepository');

describe('Trainer Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  describe('createTrainer', () => {
    it('should throw an error if name or email is missing', async () => {
      await expect(trainerService.createTrainer({ name: '', email: 'test@test.com' }))
        .rejects
        .toThrow('Name and email are required');
    });

    it('should throw an error if a trainer with the given email already exists', async () => {
      trainerRepository.findByEmail.mockResolvedValue({ name: 'Ash', email: 'ash@test.com' });

      await expect(trainerService.createTrainer({ name: 'Ash', email: 'ash@test.com' }))
        .rejects
        .toThrow('A trainer with this email already exists');
    });

    it('should create a new trainer if email is not already used', async () => {
      trainerRepository.findByEmail.mockResolvedValue(null);
      trainerRepository.create.mockResolvedValue({ name: 'Ash', email: 'ash@test.com', favorites: [] });

      const result = await trainerService.createTrainer({ name: 'Ash', email: 'ash@test.com' });
      expect(result).toEqual({ name: 'Ash', email: 'ash@test.com', favorites: [] });
    });
  });

  describe('addFavoritePokemon', () => {
    it('should throw an error if the Pokemon is not found', async () => {
      pokemonRepository.findByExternalId.mockResolvedValue(null);

      await expect(trainerService.addFavoritePokemon({ trainerId: '1', pokemonId: 25 }))
        .rejects
        .toThrow('Pokemon not found');
    });

    it('should throw an error if the trainer is not found', async () => {
      pokemonRepository.findByExternalId.mockResolvedValue({ externalId: 25 });
      trainerRepository.findById.mockResolvedValue(null);

      await expect(trainerService.addFavoritePokemon({ trainerId: '1', pokemonId: 25 }))
        .rejects
        .toThrow('Trainer not found');
    });

    it('should return a message if the Pokemon is already in favorites', async () => {
      pokemonRepository.findByExternalId.mockResolvedValue({ externalId: 25 });
      trainerRepository.findById.mockResolvedValue({
        favorites: [{ externalId: 25 }],
      });

      const result = await trainerService.addFavoritePokemon({ trainerId: '1', pokemonId: 25 });
      expect(result).toEqual({ message: 'Pokemon is already in favorites', trainer: { favorites: [{ externalId: 25 }] } });
    });

    it('should add a Pokemon to the trainers favorites', async () => {
      const pokemon = { externalId: 25, toObject: () => ({ externalId: 25 }) };
      pokemonRepository.findByExternalId.mockResolvedValue(pokemon);
      const trainer = { favorites: [], updateFavorites: jest.fn() };
      trainerRepository.findById.mockResolvedValue(trainer);

      await trainerService.addFavoritePokemon({ trainerId: '1', pokemonId: 25 });
      expect(trainerRepository.updateFavorites).toHaveBeenCalledWith(expect.objectContaining({ favorites: [{ externalId: 25 }] }));
    });
  });

  describe('removeFavoritePokemon', () => {
    it('should throw an error if the trainer is not found', async () => {
      trainerRepository.findById.mockResolvedValue(null);

      await expect(trainerService.removeFavoritePokemon('1', 25))
        .rejects
        .toThrow('Trainer not found');
    });

    it('should throw an error if the Pokemon is not found in favorites', async () => {
      trainerRepository.findById.mockResolvedValue({ favorites: [] });

      await expect(trainerService.removeFavoritePokemon('1', 25))
        .rejects
        .toThrow('Pokemon not found in favorites');
    });
  });

  describe('findTrainerByEmail', () => {
    it('should throw an error if the trainer is not found', async () => {
      trainerRepository.findByEmail.mockResolvedValue(null);

      await expect(trainerService.findTrainerByEmail('test@test.com'))
        .rejects
        .toThrow('Trainer not found');
    });

    it('should return the trainer if found', async () => {
      const trainer = { name: 'Ash', email: 'ash@test.com' };
      trainerRepository.findByEmail.mockResolvedValue(trainer);

      const result = await trainerService.findTrainerByEmail('ash@test.com');
      expect(result).toEqual(trainer);
    });
  });

  describe('getFavoritesByTrainer', () => {
    it('should throw an error if the trainer is not found', async () => {
      trainerRepository.findAllFavoritesByTrainerId.mockResolvedValue(null);

      await expect(trainerService.getFavoritesByTrainer('1', 1, 10))
        .rejects
        .toThrow('Trainer not found');
    });
  });
});
