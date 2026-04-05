const Pedido = require("../models/Pedido");

async function expirarPedidos() {
  const agora = new Date();
  const limite = new Date(agora.getTime() - 10 * 60 * 1000);

  const pedidos = await Pedido.find({
    status: "pendente",
    createdAt: { $lt: limite }
  });

  for (let pedido of pedidos) {
    pedido.status = "cancelado";
    await pedido.save();

    console.log("⏰ Pedido expirado:", pedido._id);
  }
}

module.exports = expirarPedidos;
