const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  nome: String,
  campanhaId: String,
  numeros: [Number],
  valor: Number,

  status: {
    type: String,
    default: "pendente"
  }
});

module.exports = mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
