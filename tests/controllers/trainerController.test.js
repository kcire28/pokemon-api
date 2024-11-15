const request = require('supertest');
const { app, connection } = require('../../src/server');
const trainerService = require('../../src/services/trainerService');

jest.mock('../../src/services/trainerService');

describe('Trainer Controller Tests', () => {

    beforeAll(async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(async () => {
        consoleErrorSpy.mockRestore();
        await connection.close();
    });

  describe('POST /trainers', () => {
    it('should create a trainer and return 201', async () => {
      const mockTrainer = { id: 1, name: 'Ash' };
      trainerService.createTrainer.mockResolvedValue(mockTrainer);

      const response = await request(app)
        .post('/trainers')
        .send({ name: 'Ash' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Trainer created successfully',
        trainer: mockTrainer,
      });
    });

    it('should return 400 if creation fails', async () => {
      trainerService.createTrainer.mockRejectedValue(new Error('Invalid data'));

      const response = await request(app)
        .post('/trainers')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid data',
      });
    });
  });

  describe('POST /trainers/add-favorites', () => {
    it('should add a favorite Pokemon and return 200', async () => {
      const mockResult = { message: 'Pokemon added to favorites' };
      trainerService.addFavoritePokemon.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/trainers/add-favorites')
        .send({ trainerId: 1, pokemonId: 25 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });

    it('should return 404 if Pokemon or Trainer not found', async () => {
      trainerService.addFavoritePokemon.mockRejectedValue(new Error('Pokemon not found'));

      const response = await request(app)
        .post('/trainers/add-favorites')
        .send({ trainerId: 1, pokemonId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Pokemon not found',
      });
    });
  });

  describe('GET /trainers/:trainerId/favorites', () => {
    it('should return trainer favorites', async () => {
      const mockFavorites = [{ pokemonId: 25, name: 'Pikachu' }];
      trainerService.getFavoritesByTrainer.mockResolvedValue(mockFavorites);

      const response = await request(app)
        .get('/trainers/1/favorites');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFavorites);
    });

    it('should return 404 if trainer not found', async () => {
      trainerService.getFavoritesByTrainer.mockRejectedValue(new Error('Trainer not found'));

      const response = await request(app)
        .get('/trainers/999/favorites');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Trainer not found',
      });
    });
  });

  describe('POST /trainers/verify', () => {
    it('should find a trainer by email and return 200', async () => {
      const mockTrainer = { id: 1, email: 'ash@pokemon.com' };
      trainerService.findTrainerByEmail.mockResolvedValue(mockTrainer);

      const response = await request(app)
        .post('/trainers/verify')
        .send({ email: 'ash@pokemon.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ trainer: mockTrainer });
    });

    it('should return 404 if trainer not found', async () => {
      trainerService.findTrainerByEmail.mockRejectedValue(new Error('Trainer not found'));

      const response = await request(app)
        .post('/trainers/verify')
        .send({ email: 'unknown@pokemon.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Trainer not found',
      });
    });
  });

  describe('DELETE /trainers/:trainerId/favorites', () => {
    it('should remove a favorite Pokemon and return 200', async () => {
      const mockResult = { message: 'Pokemon removed from favorites' };
      trainerService.removeFavoritePokemon.mockResolvedValue(mockResult);

      const response = await request(app)
        .delete('/trainers/1/favorites')
        .send({ externalId: '25' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });

    it('should return 404 if trainer or Pokemon not found in favorites', async () => {
      trainerService.removeFavoritePokemon.mockRejectedValue(new Error('Pokemon not found in favorites'));

      const response = await request(app)
        .delete('/trainers/1/favorites')
        .send({ externalId: '999' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Pokemon not found in favorites',
      });
    });
  });
});
