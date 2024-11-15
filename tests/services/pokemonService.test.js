const pokemonService = require('../../src/services/pokemonService');
const pokemonRepository = require('../../src/repositories/pokemonRepository');
const trainerRepository = require('../../src/repositories/trainerRepository');
const axios = require('axios');
const sinon = require('sinon');

// Test configuration
jest.mock('axios');
jest.mock('../../src/repositories/pokemonRepository');
jest.mock('../../src/repositories/trainerRepository');

describe('pokemonService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  describe('syncPokemons', () => {
    it('should synchronize Pokémon data and return a success message', async () => {
      const mockResponse = {
        data: {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
          ]
        }
      };

      const mockDetailsResponse = {
        data: {
          abilities: [{ ability: { name: 'overgrow' } }],
          base_experience: 64,
          height: 7,
          sprites: {
            front_default: 'icon_url',
            other: {
              'official-artwork': {
                front_default: 'image_url'
              }
            }
          }
        }
      };

      axios.get.mockResolvedValueOnce(mockResponse);
      axios.get.mockResolvedValue(mockDetailsResponse);
      pokemonRepository.deleteAll.mockResolvedValue();
      pokemonRepository.insertMany.mockResolvedValue();

      const result = await pokemonService.syncPokemons();

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://pokeapi.co/api/v2/pokemon'));
      expect(pokemonRepository.insertMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Pokémon data synchronized successfully' });
    });

    it('should handle errors when fetching Pokémon details', async () => {
      const mockResponse = {
        data: {
          results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
        }
      };

      axios.get.mockResolvedValueOnce(mockResponse);
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      pokemonRepository.deleteAll.mockResolvedValue();
      pokemonRepository.insertMany.mockResolvedValue();

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await pokemonService.syncPokemons();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching details for bulbasaur'), expect.any(Error));
      expect(result).toEqual({ message: 'Pokémon data synchronized successfully' });
      consoleSpy.mockRestore();
    });
  });

  describe('getAllPokemons', () => {
    it('should return paginated Pokémon data with favorites', async () => {
      const trainerId = '12345';
      const mockTrainer = { favorites: [{ externalId: 1 }] };
      const mockPokemons = [
        { externalId: 1, name: 'bulbasaur' },
        { externalId: 2, name: 'ivysaur' }
      ];

      trainerRepository.findById.mockResolvedValue(mockTrainer);
      pokemonRepository.findAll.mockResolvedValue(mockPokemons);
      pokemonRepository.countAll.mockResolvedValue(20);

      const result = await pokemonService.getAllPokemons(1, 10, trainerId);

      expect(trainerRepository.findById).toHaveBeenCalledWith(trainerId);
      expect(pokemonRepository.findAll).toHaveBeenCalledWith(0, 10, [1]);
      expect(result).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalPokemons: 20,
        pokemons: mockPokemons
      });
    });

    it('should throw an error if limit is invalid', async () => {
      await expect(pokemonService.getAllPokemons(1, 'invalid', '12345')).rejects.toThrow('The limit parameter must be a number greater than 0');
    });
  });

  describe('searchByExternalId', () => {
    it('should return a Pokémon by external ID', async () => {
      const externalId = 1;
      const mockPokemon = { externalId: 1, name: 'bulbasaur' };

      pokemonRepository.findByExternalId.mockResolvedValue(mockPokemon);

      const result = await pokemonService.searchByExternalId(externalId);

      expect(pokemonRepository.findByExternalId).toHaveBeenCalledWith(externalId);
      expect(result).toEqual(mockPokemon);
    });

    it('should throw an error if no external ID is provided', async () => {
      await expect(pokemonService.searchByExternalId()).rejects.toThrow('The externalId parameter is required');
    });

    it('should throw an error if Pokémon is not found', async () => {
      const externalId = 99;
      pokemonRepository.findByExternalId.mockResolvedValue(null);

      await expect(pokemonService.searchByExternalId(externalId)).rejects.toThrow('Pokemon not found');
    });
  });
});
