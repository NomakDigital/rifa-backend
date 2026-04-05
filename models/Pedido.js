const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  nome: String,
  campanhaId: String,
  numeros: [Number],
  valor: Number,
  pagamentoId: String,
  status: {
    type: String,
    default: "pendente"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔥 CORREÇÃO AQUI
module.exports = mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
