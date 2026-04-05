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

    // gerar números
    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      numeros.push(Math.floor(Math.random() * 10000));
    }

    const valor = qtd * 5;

    // salvar pedido
    const pedido = await Pedido.create({
      nome,
      campanhaId,
      numeros,
      valor,
      status: "pendente"
    });

    // criar pagamento PIX
    const pagamento = await mercadopago.payment.create({
      transaction_amount: valor,
      description: "Compra de números",
      payment_method_id: "pix",
      payer: {
        email: "teste@test.com"
      }
    });

    // 👉 SALVA ID DO PAGAMENTO
    pedido.pagamentoId = pagamento.body.id;
    await pedido.save();

    // 👉 PEGA DADOS DO PIX (AQUI É O LUGAR CERTO)
    const dadosPix = pagamento.body.point_of_interaction.transaction_data;

    // 👉 RETORNA PRO FRONT
    res.json({
      qr_code: dadosPix.qr_code,
      qr_code_base64: dadosPix.qr_code_base64
    });

  } catch (error) {
    console.log("❌ ERRO PIX:", error);
    res.status(500).json({ error: "Erro ao gerar pagamento" });
  }
});

module.exports = router;
