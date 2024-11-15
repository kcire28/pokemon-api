const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/', trainerController.createTrainer);
router.post('/add-favorites', trainerController.addFavoritePokemon);
router.post('/verify', trainerController.findTrainerByEmail);
router.get('/:trainerId/favorites', trainerController.getFavoritesByTrainer);
router.delete('/:trainerId/favorites', trainerController.removeFavoritePokemon);

module.exports = router;
