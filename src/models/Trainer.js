const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  favorites: [{ type: mongoose.Schema.Types.Mixed }]
});

const Trainers = mongoose.model('Trainers', trainerSchema);

module.exports = Trainers;
