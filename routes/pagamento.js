const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

const Pedido = require("../models/Pedido");
const Campanha = require("../models/Campanha");

router.post("/criar", async (req, res) => {
  try {
    const { nome, campanhaId, qtd } = req.body;

    const campanha = await Campanha.findById(campanhaId);

    if (!campanha) {
      return res.status(404).json({ error: "Campanha não encontrada" });
    }

    // pegar pedidos pendentes
    const pedidosPendentes = await Pedido.find({
      campanhaId,
      status: "pendente"
    });

    let numerosUsados = [
      ...campanha.numerosVendidos,
      ...pedidosPendentes.flatMap(p => p.numeros)
    ];

    // gerar números únicos
    const numeros = [];

    while (numeros.length < qtd) {
      const num = Math.floor(Math.random() * campanha.numerosTotal);

      if (!numerosUsados.includes(num)) {
        numeros.push(num);
        numerosUsados.push(num);
      }
    }

    const valor = qtd * campanha.preco;

    const pedido = await Pedido.create({
      nome,
      campanhaId,
      numeros,
      valor,
      status: "pendente"
    });

    const pagamento = await mercadopago.payment.create({
      transaction_amount: valor,
      description: "Compra de números",
      payment_method_id: "pix",
      payer: {
        email: "teste@test.com"
      }
    });

    pedido.pagamentoId = pagamento.body.id;
    await pedido.save();

    const dadosPix = pagamento.body.point_of_interaction.transaction_data;

    res.json({
      qr_code: dadosPix.qr_code,
      qr_code_base64: dadosPix.qr_code_base64,
      numeros
    });

  } catch (error) {
    console.log("❌ ERRO PIX:", error);
    res.status(500).json({ error: "Erro ao gerar pagamento" });
  }
});

module.exports = router;

router.get("/status/:id", async (req, res) => {
  try {
    const Pedido = require("../models/Pedido");

    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.json({ status: "nao_encontrado" });
    }

    res.json({ status: pedido.status || "pendente" });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar status" });
  }
});
