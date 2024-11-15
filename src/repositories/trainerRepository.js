const Trainer = require('../models/Trainer');
const mongoose = require('mongoose');

class TrainerRepository {
  async create(trainerData) {
    const newTrainer = new Trainer(trainerData);
    return await newTrainer.save();
  }

  async findById(trainerId) {
    // Verifica si trainerId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      throw new Error('El ID del entrenador no es válido');
    }

    return await Trainer.findById(trainerId);
  }

  async findByEmail(email) {
    return await Trainer.findOne({ email });
  }

  async findAllFavoritesByTrainerId(trainerId, skip = 0, limit = 10) {
    return await Trainer.findById(trainerId)
      .populate({
        path: 'favorites',
        select: 'name type',
        options: { skip, limit },
      })
      .exec();
  }

  async updateFavorites(trainer) {
    return await trainer.save();
  }
}

module.exports = new TrainerRepository();
