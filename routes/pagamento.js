const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

const Pedido = require("../models/Pedido");

// ROTA PIX
router.post("/criar", async (req, res) => {
  try {
    const { nome, campanhaId, qtd } = req.body;

    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      numeros.push(Math.floor(Math.random() * 10000));
    }

    const valor = qtd * 1;

    const pedido = await Pedido.create({
      nome,
      campanhaId,
      numeros,
      valor
    });

    const pagamento = await mercadopago.payment.create({
      transaction_amount: valor,
      description: "Compra de números",
      payment_method_id: "pix",
      payer: { email: "teste@test.com" }
    });

    res.json({
      pix: pagamento.body.point_of_interaction.transaction_data.qr_code,
      copiaCola: pagamento.body.point_of_interaction.transaction_data.qr_code_base64,
      pedidoId: pedido._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro no pagamento" });
  }
});

// ROTA TESTE
router.get("/", (req, res) => {
  res.json({ msg: "rota pagamento ok" });
});

module.exports = router;
