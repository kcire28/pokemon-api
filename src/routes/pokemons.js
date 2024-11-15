const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');

router.get('/exclude/:trainerId', pokemonController.getAllPokemons);

router.get('/sync', pokemonController.syncPokemons);

router.get('/external/:externalId', pokemonController.searchByExternalId);

module.exports = router;
