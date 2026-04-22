const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

const Pedido = require("../models/Pedido");
const Campanha = require("../models/Campanha");

// CRIAR PIX
router.post("/criar", async (req, res) => {
  try {
    const { nome, campanhaId, qtd } = req.body;

    const campanha = await Campanha.findById(campanhaId);

    if (!campanha) {
      return res.status(404).json({ erro: "Campanha não encontrada" });
    }

    // gerar números
    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      numeros.push(Math.floor(Math.random() * 10000));
    }

    // 💰 CALCULO PROFISSIONAL
    let valor = campanha.preco * qtd;

    // 🔥 PROMOÇÃO (se existir)
    if (campanha.promocaoQtd > 0 && campanha.promocaoPreco > 0) {
      const grupos = Math.floor(qtd / campanha.promocaoQtd);
      const resto = qtd % campanha.promocaoQtd;

      valor =
        grupos * campanha.promocaoPreco +
        resto * campanha.preco;
    }

    // evitar erro com valores muito baixos
    if (valor < 0.5) {
      valor = 0.5;
    }

    const pedido = await Pedido.create({
      nome,
      campanhaId,
      numeros,
      valor
    });

    const pagamento = await mercadopago.payment.create({
      transaction_amount: Number(valor),
      description: "Compra de números",
      payment_method_id: "pix",
      payer: {
        email: "teste@test.com"
      }
    });

    const dadosPix =
      pagamento.body.point_of_interaction.transaction_data;

    res.json({
      qr_code: dadosPix.qr_code,
      qr_code_base64: dadosPix.qr_code_base64,
      pedidoId: pedido._id,
      valor
    });

  } catch (err) {
    console.log("ERRO PIX:", err);
    res.status(500).json({ erro: "Erro ao gerar PIX" });
  }
});

// STATUS
router.get("/status/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.json({ status: "nao_encontrado" });
    }

    res.json({ status: pedido.status || "pendente" });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar status" });
  }
});

module.exports = router;
