const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');


/**
 * @swagger
 * tags:
 *   - name: Trainers
 *     description: API for managing Trainers and their favorites
 */

/**
 * @swagger
 * /trainers:
 *   post:
 *     tags:
 *       - Trainers
 *     summary: Create a new trainer
 *     description: Creates a new trainer in the system.
 *     responses:
 *       201:
 *         description: Trainer created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', trainerController.createTrainer);

/**
 * @swagger
 * /trainers/add-favorites:
 *   post:
 *     tags:
 *       - Trainers
 *     summary: Add a favorite Pokémon for a trainer
 *     description: Adds a Pokémon to the trainer's list of favorite Pokémon.
 *     responses:
 *       200:
 *         description: Pokémon added to favorites successfully
 *       404:
 *         description: Pokémon or Trainer not found
 */
router.post('/add-favorites', trainerController.addFavoritePokemon);

/**
 * @swagger
 * /trainers/verify:
 *   post:
 *     tags:
 *       - Trainers
 *     summary: Verify a trainer by email
 *     description: Verifies if a trainer exists based on the provided email.
 *     responses:
 *       200:
 *         description: Trainer verified successfully
 *       404:
 *         description: Trainer not found
 */
router.post('/verify', trainerController.findTrainerByEmail);

/**
 * @swagger
 * /trainers/{trainerId}/favorites:
 *   get:
 *     tags:
 *       - Trainers
 *     summary: Get the list of favorite Pokémon for a trainer
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         required: true
 *         description: The ID of the trainer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of favorite Pokémon for the trainer.
 *       404:
 *         description: Trainer not found
 */
router.get('/:trainerId/favorites', trainerController.getFavoritesByTrainer);

/**
 * @swagger
 * /trainers/{trainerId}/favorites:
 *   delete:
 *     tags:
 *       - Trainers
 *     summary: Remove a Pokémon from a trainer's favorites
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         required: true
 *         description: The ID of the trainer.
 *         schema:
 *           type: string
 *       - in: body
 *         name: externalId
 *         description: The external ID of the Pokémon to remove from favorites.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             externalId:
 *               type: string
 *     responses:
 *       200:
 *         description: Pokémon removed from favorites successfully
 *       404:
 *         description: Trainer or Pokémon not found
 */
router.delete('/:trainerId/favorites', trainerController.removeFavoritePokemon);

module.exports = router;
