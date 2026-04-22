const mongoose = require("mongoose");

const CampanhaSchema = new mongoose.Schema({
  nome: String,

  // preço padrão por número
  preco: {
    type: Number,
    required: true
  },

  // PROMOÇÃO (opcional)
  promocaoQtd: {
    type: Number,
    default: 0
  },

  promocaoPreco: {
    type: Number,
    default: 0
  },

  numerosTotal: {
    type: Number,
    default: 10000
  },

  numerosVendidos: {
    type: [Number],
    default: []
  }
});

module.exports =
  mongoose.models.Campanha ||
  mongoose.model("Campanha", CampanhaSchema);
