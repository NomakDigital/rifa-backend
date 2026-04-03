
const mongoose = require("mongoose");

const Campanha = mongoose.model("Campanha", {
  nome: String,
  imagem: String,
  preco: Number,
  totalNumeros: Number,
  vendidos: { type: Number, default: 0 }
});

module.exports = Campanha;
