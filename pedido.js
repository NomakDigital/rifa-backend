const mongoose = require("mongoose");

const Pedido = mongoose.model("Pedido", {
  campanhaId: String,
  nome: String,
  numeros: Array,
  valor: Number,
  pago: { type: Boolean, default: false }
});

module.exports = Pedido;