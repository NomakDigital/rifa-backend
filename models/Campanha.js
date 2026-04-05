const mongoose = require("mongoose");

const CampanhaSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  numerosTotal: {
    type: Number,
    default: 10000
  },
  numerosVendidos: {
    type: [Number],
    default: []
  }
});

module.exports = mongoose.models.Campanha || mongoose.model("Campanha", CampanhaSchema);
