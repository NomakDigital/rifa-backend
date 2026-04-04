const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

const Pedido = require("../models/Pedido");

router.post("/criar", async (req, res) => {
  try {
    const { nome, campanhaId, qtd } = req.body;

    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      numeros.push(Math.floor(Math.random() * 10000));
    }

    const valor = qtd * 5;

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

    const pixData = pagamento.body.point_of_interaction?.transaction_data;

    res.json({
      pix: pixData?.qr_code || "erro ao gerar pix",
      qrCodeBase64: pixData?.qr_code_base64,
      pedidoId: pedido._id
    });

  } catch (err) {
    console.log("ERRO PIX:", err);
    res.status(500).json({ erro: "Erro ao gerar PIX" });
  }
});

module.exports = router;
