const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');


/**
 * @swagger
 * tags:
 *   - name: Pokemons
 *     description: API for managing Pokémon
 */

/**
 * @swagger
 * /pokemons/exclude/{trainerId}:
 *   get:
 *     tags:
 *       - Pokemons
 *     summary: Get all Pokémon excluding those already associated with a trainer
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         required: true
 *         description: The ID of the trainer to exclude their Pokémon.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Pokémon excluding the trainer's Pokémon.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Trainer not found
 */
router.get('/exclude/:trainerId', pokemonController.getAllPokemons);

/**
 * @swagger
 * /pokemons/sync:
 *   get:
 *     tags:
 *       - Pokemons
 *     summary: Sync Pokémon data
 *     description: Synchronizes Pokémon data from an external source.
 *     responses:
 *       200:
 *         description: Pokémon data synchronized successfully
 *       500:
 *         description: Error while synchronizing Pokémon data
 */
router.get('/sync', pokemonController.syncPokemons);

/**
 * @swagger
 * /pokemons/external/{externalId}:
 *   get:
 *     tags:
 *       - Pokemons
 *     summary: Get Pokémon by external ID
 *     description: Retrieves a Pokémon by its external ID from an external source.
 *     parameters:
 *       - in: path
 *         name: externalId
 *         required: true
 *         description: The external ID of the Pokémon.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokémon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *       404:
 *         description: Pokémon not found
 *       500:
 *         description: Error while retrieving Pokémon
 */
router.get('/external/:externalId', pokemonController.searchByExternalId);

module.exports = router;
