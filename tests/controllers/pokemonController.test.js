const request = require('supertest');
const { app, connection } = require('../../src/server');
const pokemonService = require('../../src/services/pokemonService');

jest.mock('../../src/services/pokemonService');

describe('pokemonController', () => {
  beforeAll(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    consoleErrorSpy.mockRestore();
    await connection.close();
  });

  describe('POST /sync', () => {
    it('should sync pokemons successfully', async () => {
      pokemonService.syncPokemons.mockResolvedValue({ message: 'Sync successful' });

      const response = await request(app).get('/pokemons/sync');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sync successful');
    });

    it('should return error if sync fails', async () => {
      pokemonService.syncPokemons.mockRejectedValue(new Error('Sync failed'));
      const response = await request(app).get('/pokemons/sync');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching or inserting data');
    });
  });

  describe('GET /pokemons/exclude/:trainerId', () => {
    it('should return all pokemons successfully', async () => {
      const mockPokemons = [{ name: 'Pikachu' }, { name: 'Charmander' }];
      pokemonService.getAllPokemons.mockResolvedValue(mockPokemons);

      const response = await request(app).get('/pokemons/exclude/123?page=1&limit=10');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemons);
    });

    it('should return 400 if limit parameter is invalid', async () => {
      pokemonService.getAllPokemons.mockRejectedValue(new Error('The limit parameter must be a number greater than 0'));

      const response = await request(app).get('/pokemons/exclude/123?page=1&limit=0');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('The limit parameter must be a number greater than 0');
    });

    it('should return 500 for other errors', async () => {
      pokemonService.getAllPokemons.mockRejectedValue(new Error('Unexpected error'));
      
      const response = await request(app).get('/pokemons/exclude/123');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching Pokémon');
    });
  });

  describe('GET /pokemons/external/:externalId', () => {
    it('should return a pokemon by external ID successfully', async () => {
      const mockPokemon = { name: 'Bulbasaur', id: '001' };
      pokemonService.searchByExternalId.mockResolvedValue(mockPokemon);

      const response = await request(app).get('/pokemons/external/001');
      expect(response.status).toBe(200);
      expect(response.body.pokemon).toEqual(mockPokemon);
    });

    it('should return 404 if pokemon not found', async () => {
      pokemonService.searchByExternalId.mockRejectedValue(new Error('Pokemon not found'));

      const response = await request(app).get('/pokemons/external/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Pokemon not found');
    });

    it('should return 500 for other errors', async () => {
      pokemonService.searchByExternalId.mockRejectedValue(new Error('Unexpected error'));
      
      const response = await request(app).get('/pokemons/external/001');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching Pokémon');
    });
  });

});
